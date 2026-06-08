import { Router } from "express";
import { db } from "@workspace/db";
import { inquiriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListInquiriesResponse,
  CreateInquiryBody,
  UpdateInquiryParams,
  UpdateInquiryBody,
} from "@workspace/api-zod";
import { sendNewInquiryAlert } from "../lib/email";

const router = Router();

function inquiryToJson(i: typeof inquiriesTable.$inferSelect) {
  return {
    ...i,
    createdAt: i.createdAt.toISOString(),
  };
}

router.get("/inquiries", async (req, res) => {
  try {
    const inquiries = await db.select().from(inquiriesTable).orderBy(inquiriesTable.createdAt);
    const parsed = ListInquiriesResponse.parse(inquiries.map(inquiryToJson));
    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Failed to list inquiries");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/inquiries", async (req, res) => {
  try {
    const body = CreateInquiryBody.parse(req.body);
    const [inquiry] = await db.insert(inquiriesTable).values({
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      subject: body.subject,
      message: body.message,
      serviceInterest: body.serviceInterest ?? null,
      status: "new",
    }).returning();
    // Fire-and-forget email alert
    sendNewInquiryAlert({
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      subject: inquiry.subject,
      message: inquiry.message,
      serviceInterest: inquiry.serviceInterest,
    }).catch(() => {});
    res.status(201).json(inquiryToJson(inquiry));
  } catch (err) {
    req.log.error({ err }, "Failed to create inquiry");
    res.status(400).json({ error: "Bad request" });
  }
});

router.patch("/inquiries/:id", async (req, res) => {
  try {
    const { id } = UpdateInquiryParams.parse({ id: Number(req.params.id) });
    const body = UpdateInquiryBody.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (body.status !== undefined) updateData.status = body.status;
    const [inquiry] = await db.update(inquiriesTable).set(updateData).where(eq(inquiriesTable.id, id)).returning();
    if (!inquiry) return res.status(404).json({ error: "Not found" });
    res.json(inquiryToJson(inquiry));
  } catch (err) {
    req.log.error({ err }, "Failed to update inquiry");
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;
