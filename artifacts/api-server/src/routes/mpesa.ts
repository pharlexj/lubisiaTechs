import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// ── helpers ──────────────────────────────────────────────────────────────────

async function getMpesaConfig(): Promise<Record<string, string>> {
  const rows = await db
    .select()
    .from(siteSettingsTable)
    .where(eq(siteSettingsTable.group, "M-Pesa"));
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

function baseUrl(env: string) {
  return env === "live"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

async function getAccessToken(
  consumerKey: string,
  consumerSecret: string,
  env: string
): Promise<string> {
  const creds = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );
  const res = await fetch(
    `${baseUrl(env)}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${creds}` } }
  );
  if (!res.ok) throw new Error(`OAuth failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

function makePassword(shortcode: string, passkey: string, timestamp: string) {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
}

function timestamp() {
  return new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "254" + digits.slice(1);
  if (digits.startsWith("254")) return digits;
  return "254" + digits;
}

// ── POST /mpesa/stk-push ─────────────────────────────────────────────────────

router.post("/mpesa/stk-push", async (req, res) => {
  try {
    const cfg = await getMpesaConfig();

    const consumerKey = cfg["mpesa.consumer_key"] ?? "";
    const consumerSecret = cfg["mpesa.consumer_secret"] ?? "";
    const shortcode = cfg["mpesa.shortcode"] ?? "";
    const passkey = cfg["mpesa.passkey"] ?? "";
    const callbackUrl = cfg["mpesa.callback_url"] ?? "";
    const env = cfg["mpesa.environment"] ?? "sandbox";

    if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
      res.status(503).json({
        error:
          "M-Pesa not configured. Ask the admin to add API credentials in Settings.",
      });
      return;
    }

    const { phone, amount, orderId, reference } = req.body as {
      phone: string;
      amount: number;
      orderId?: number;
      reference?: string;
    };

    if (!phone || !amount) {
      res.status(400).json({ error: "phone and amount are required" });
      return;
    }

    const ts = timestamp();
    const password = makePassword(shortcode, passkey, ts);
    const normalizedPhone = normalizePhone(phone);
    const token = await getAccessToken(consumerKey, consumerSecret, env);

    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount),
      PartyA: normalizedPhone,
      PartyB: shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL:
        callbackUrl ||
        `${process.env["REPLIT_DEV_DOMAIN"] ? `https://${process.env["REPLIT_DEV_DOMAIN"]}` : "https://example.com"}/api/mpesa/callback`,
      AccountReference: reference ?? (orderId ? `ORDER-${orderId}` : "LubisiaTech"),
      TransactionDesc: "Payment for order",
    };

    const stkRes = await fetch(
      `${baseUrl(env)}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = (await stkRes.json()) as Record<string, unknown>;

    if (!stkRes.ok) {
      req.log.error({ data }, "STK push failed");
      res
        .status(502)
        .json({ error: "STK push failed", detail: data });
      return;
    }

    req.log.info({ orderId, phone: normalizedPhone, amount }, "STK push sent");
    res.json({
      checkoutRequestId: data["CheckoutRequestID"] as string,
      merchantRequestId: data["MerchantRequestID"] as string,
      message: (data["CustomerMessage"] as string) ?? "STK push sent",
    });
  } catch (err) {
    req.log.error({ err }, "STK push error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /mpesa/callback ─────────────────────────────────────────────────────

router.post("/mpesa/callback", async (req, res) => {
  try {
    const callback = req.body as {
      Body?: {
        stkCallback?: {
          ResultCode?: number;
          ResultDesc?: string;
          CallbackMetadata?: {
            Item?: Array<{ Name: string; Value: unknown }>;
          };
        };
      };
    };

    const cb = callback?.Body?.stkCallback;
    if (!cb) {
      res.json({ ResultCode: 0, ResultDesc: "Accepted" });
      return;
    }

    const resultCode = cb.ResultCode ?? -1;
    const resultDesc = cb.ResultDesc ?? "";

    if (resultCode === 0) {
      const items = cb.CallbackMetadata?.Item ?? [];
      const get = (name: string) =>
        items.find((i) => i.Name === name)?.Value;
      const mpesaRef = get("MpesaReceiptNumber") as string | undefined;
      const phoneRaw = get("PhoneNumber");
      const amountPaid = get("Amount");

      req.log.info(
        { mpesaRef, phoneRaw, amountPaid },
        "M-Pesa payment confirmed"
      );

      // Try to update order status if AccountReference matches ORDER-{id}
      const accountRef = (cb as any).AccountReference as string | undefined;
      if (accountRef) {
        const match = accountRef.match(/ORDER-(\d+)/);
        if (match) {
          const orderId = parseInt(match[1], 10);
          await db
            .update(ordersTable)
            .set({ status: "confirmed" })
            .where(eq(ordersTable.id, orderId));
          req.log.info({ orderId }, "Order marked confirmed after M-Pesa payment");
        }
      }
    } else {
      req.log.warn({ resultCode, resultDesc }, "M-Pesa payment failed/cancelled");
    }

    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    req.log.error({ err }, "Callback error");
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
});

// ── GET /mpesa/status ────────────────────────────────────────────────────────

router.get("/mpesa/status", async (req, res) => {
  const cfg = await getMpesaConfig();
  const configured = !!(cfg["mpesa.consumer_key"] && cfg["mpesa.shortcode"]);
  res.json({
    configured,
    environment: cfg["mpesa.environment"] ?? "sandbox",
  });
});

export default router;
