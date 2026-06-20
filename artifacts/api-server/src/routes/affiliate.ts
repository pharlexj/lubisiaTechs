import { Router } from "express";
import { db } from "@workspace/db";
import { affiliateProgramsTable, affiliateLinksTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import {
  ListAffiliateProgramsResponse,
  CreateAffiliateProgramBody,
  UpdateAffiliateProgramParams,
  UpdateAffiliateProgramBody,
  DeleteAffiliateProgramParams,
  ListAffiliateLinksQueryParams,
  ListAffiliateLinksResponse,
  CreateAffiliateLinkBody,
  UpdateAffiliateLinkParams,
  UpdateAffiliateLinkBody,
  DeleteAffiliateLinkParams,
  TrackAffiliateLinkClickParams,
} from "@workspace/api-zod";

const router = Router();

async function programTotalClicks(programId: number): Promise<number> {
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${affiliateLinksTable.clicks}), 0)` })
    .from(affiliateLinksTable)
    .where(eq(affiliateLinksTable.programId, programId));
  return Number(row?.total ?? 0);
}

function programToJson(p: typeof affiliateProgramsTable.$inferSelect, totalClicks = 0) {
  return {
    ...p,
    commissionRate: p.commissionRate !== null ? Number(p.commissionRate) : null,
    totalClicks,
    createdAt: p.createdAt.toISOString(),
  };
}

async function linkWithProgram(link: typeof affiliateLinksTable.$inferSelect) {
  const [prog] = await db.select().from(affiliateProgramsTable).where(eq(affiliateProgramsTable.id, link.programId));
  return {
    ...link,
    programName: prog?.name ?? "",
    programSlug: prog?.slug ?? "",
    price: link.price !== null ? Number(link.price) : null,
    originalPrice: link.originalPrice !== null ? Number(link.originalPrice) : null,
    createdAt: link.createdAt.toISOString(),
  };
}

// ── Programs ──────────────────────────────────────────────────────────────

router.get("/affiliate/programs", async (req, res) => {
  try {
    const programs = await db.select().from(affiliateProgramsTable).orderBy(affiliateProgramsTable.name);
    const result = await Promise.all(
      programs.map(async (p) => programToJson(p, await programTotalClicks(p.id)))
    );
    return res.json(ListAffiliateProgramsResponse.parse(result));
  } catch (err) {
    req.log.error({ err }, "Failed to list affiliate programs");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/affiliate/programs", async (req, res) => {
  try {
    const body = CreateAffiliateProgramBody.parse(req.body);
    const [program] = await db.insert(affiliateProgramsTable).values({
      name: body.name,
      slug: body.slug,
      baseUrl: body.baseUrl,
      affiliateId: body.affiliateId,
      description: body.description ?? null,
      logoUrl: body.logoUrl ?? null,
      commissionRate: body.commissionRate !== null && body.commissionRate !== undefined ? String(body.commissionRate) : null,
      active: body.active ?? true,
    }).returning();
    return res.status(201).json(programToJson(program, 0));
  } catch (err) {
    req.log.error({ err }, "Failed to create affiliate program");
    return res.status(400).json({ error: "Bad request" });
  }
});

router.patch("/affiliate/programs/:id", async (req, res) => {
  try {
    const { id } = UpdateAffiliateProgramParams.parse({ id: Number(req.params.id) });
    const body = UpdateAffiliateProgramBody.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.baseUrl !== undefined) updateData.baseUrl = body.baseUrl;
    if (body.affiliateId !== undefined) updateData.affiliateId = body.affiliateId;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.logoUrl !== undefined) updateData.logoUrl = body.logoUrl;
    if (body.commissionRate !== undefined) updateData.commissionRate = body.commissionRate !== null ? String(body.commissionRate) : null;
    if (body.active !== undefined) updateData.active = body.active;
    const [program] = await db.update(affiliateProgramsTable).set(updateData).where(eq(affiliateProgramsTable.id, id)).returning();
    if (!program) return res.status(404).json({ error: "Not found" });
    return res.json(programToJson(program, await programTotalClicks(id)));
  } catch (err) {
    req.log.error({ err }, "Failed to update affiliate program");
    return res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/affiliate/programs/:id", async (req, res) => {
  try {
    const { id } = DeleteAffiliateProgramParams.parse({ id: Number(req.params.id) });
    await db.delete(affiliateProgramsTable).where(eq(affiliateProgramsTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete affiliate program");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Links ──────────────────────────────────────────────────────────────────

router.get("/affiliate/links", async (req, res) => {
  try {
    const query = ListAffiliateLinksQueryParams.parse(req.query);
    const conditions = [];
    if (query.programId !== undefined) conditions.push(eq(affiliateLinksTable.programId, query.programId));
    if (query.category) conditions.push(eq(affiliateLinksTable.category, query.category));
    if (query.featured !== undefined) conditions.push(eq(affiliateLinksTable.featured, query.featured));
    const links = await db
      .select()
      .from(affiliateLinksTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(affiliateLinksTable.createdAt);
    const result = await Promise.all(links.map(linkWithProgram));
    return res.json(ListAffiliateLinksResponse.parse(result));
  } catch (err) {
    req.log.error({ err }, "Failed to list affiliate links");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/affiliate/links", async (req, res) => {
  try {
    const body = CreateAffiliateLinkBody.parse(req.body);
    const [link] = await db.insert(affiliateLinksTable).values({
      programId: body.programId,
      title: body.title,
      description: body.description ?? null,
      affiliateUrl: body.affiliateUrl,
      imageUrl: body.imageUrl ?? null,
      category: body.category,
      price: body.price !== null && body.price !== undefined ? String(body.price) : null,
      originalPrice: body.originalPrice !== null && body.originalPrice !== undefined ? String(body.originalPrice) : null,
      currency: body.currency ?? "KES",
      featured: body.featured ?? false,
      active: body.active ?? true,
    }).returning();
    return res.status(201).json(await linkWithProgram(link));
  } catch (err) {
    req.log.error({ err }, "Failed to create affiliate link");
    return res.status(400).json({ error: "Bad request" });
  }
});

router.patch("/affiliate/links/:id", async (req, res) => {
  try {
    const { id } = UpdateAffiliateLinkParams.parse({ id: Number(req.params.id) });
    const body = UpdateAffiliateLinkBody.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.affiliateUrl !== undefined) updateData.affiliateUrl = body.affiliateUrl;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.price !== undefined) updateData.price = body.price !== null ? String(body.price) : null;
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice !== null ? String(body.originalPrice) : null;
    if (body.currency !== undefined) updateData.currency = body.currency;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.active !== undefined) updateData.active = body.active;
    if (body.programId !== undefined) updateData.programId = body.programId;
    const [link] = await db.update(affiliateLinksTable).set(updateData).where(eq(affiliateLinksTable.id, id)).returning();
    if (!link) return res.status(404).json({ error: "Not found" });
    return res.json(await linkWithProgram(link));
  } catch (err) {
    req.log.error({ err }, "Failed to update affiliate link");
    return res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/affiliate/links/:id", async (req, res) => {
  try {
    const { id } = DeleteAffiliateLinkParams.parse({ id: Number(req.params.id) });
    await db.delete(affiliateLinksTable).where(eq(affiliateLinksTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete affiliate link");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/affiliate/links/:id/click", async (req, res) => {
  try {
    const { id } = TrackAffiliateLinkClickParams.parse({ id: Number(req.params.id) });
    const [link] = await db.select().from(affiliateLinksTable).where(eq(affiliateLinksTable.id, id));
    if (!link) return res.status(404).json({ error: "Not found" });
    const [updated] = await db
      .update(affiliateLinksTable)
      .set({ clicks: link.clicks + 1 })
      .where(eq(affiliateLinksTable.id, id))
      .returning();
    return res.json({ redirectUrl: link.affiliateUrl, clicks: updated.clicks });
  } catch (err) {
    req.log.error({ err }, "Failed to track click");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
