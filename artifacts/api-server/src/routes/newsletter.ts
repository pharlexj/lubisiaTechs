import { Router } from "express";
import { db } from "@workspace/db";
import { newsletterSubscribersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SubscribeNewsletterBody } from "@workspace/api-zod";
import { sendNewsletterWelcome } from "../lib/email";

const router = Router();

function subToJson(s: typeof newsletterSubscribersTable.$inferSelect) {
  return { ...s, subscribedAt: s.subscribedAt.toISOString() };
}

router.post("/newsletter/subscribe", async (req, res) => {
  try {
    const body = SubscribeNewsletterBody.parse(req.body);
    const existing = await db.select().from(newsletterSubscribersTable).where(eq(newsletterSubscribersTable.email, body.email.toLowerCase()));
    if (existing.length > 0) {
      return res.status(201).json(subToJson(existing[0]));
    }
    const [sub] = await db.insert(newsletterSubscribersTable).values({
      email: body.email.toLowerCase(),
      name: body.name ?? null,
    }).returning();
    sendNewsletterWelcome(sub.email, sub.name ?? undefined).catch(() => {});
    return res.status(201).json(subToJson(sub));
  } catch (err) {
    req.log.error({ err }, "Failed to subscribe to newsletter");
    return res.status(400).json({ error: "Bad request" });
  }
});

router.get("/newsletter/subscribers", async (req, res) => {
  try {
    const subs = await db.select().from(newsletterSubscribersTable).orderBy(newsletterSubscribersTable.subscribedAt);
    return res.json(subs.map(subToJson));
  } catch (err) {
    req.log.error({ err }, "Failed to list newsletter subscribers");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
