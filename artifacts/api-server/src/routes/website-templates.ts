import { Router } from "express";
import { db } from "@workspace/db";
import { websiteTemplatesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListWebsiteTemplatesQueryParams,
  CreateWebsiteTemplateBody,
  GetWebsiteTemplateParams,
  UpdateWebsiteTemplateParams,
  UpdateWebsiteTemplateBody,
  DeleteWebsiteTemplateParams,
} from "@workspace/api-zod";

const router = Router();

function templateToJson(t: typeof websiteTemplatesTable.$inferSelect) {
  return {
    ...t,
    price: Number(t.price),
    createdAt: t.createdAt.toISOString(),
  };
}

router.get("/website-templates", async (req, res) => {
  try {
    const query = ListWebsiteTemplatesQueryParams.parse(req.query);
    const conditions = [eq(websiteTemplatesTable.active, true)];
    if (query.category) conditions.push(eq(websiteTemplatesTable.category, query.category));
    if (query.featured !== undefined) conditions.push(eq(websiteTemplatesTable.featured, query.featured));
    const templates = await db
      .select()
      .from(websiteTemplatesTable)
      .where(and(...conditions))
      .orderBy(websiteTemplatesTable.createdAt);
    return res.json(templates.map(templateToJson));
  } catch (err) {
    req.log.error({ err }, "Failed to list website templates");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/website-templates", async (req, res) => {
  try {
    const body = CreateWebsiteTemplateBody.parse(req.body);
    const [template] = await db.insert(websiteTemplatesTable).values({
      name: body.name,
      description: body.description,
      category: body.category,
      price: String(body.price),
      previewUrl: body.previewUrl ?? null,
      screenshotUrl: body.screenshotUrl ?? null,
      features: body.features ?? "[]",
      techStack: body.techStack ?? null,
      deliveryDays: body.deliveryDays ?? 7,
      active: body.active ?? true,
      featured: body.featured ?? false,
    }).returning();
    return res.status(201).json(templateToJson(template));
  } catch (err) {
    req.log.error({ err }, "Failed to create website template");
    return res.status(400).json({ error: "Bad request" });
  }
});

router.get("/website-templates/:id", async (req, res) => {
  try {
    const { id } = GetWebsiteTemplateParams.parse({ id: Number(req.params.id) });
    const [template] = await db.select().from(websiteTemplatesTable).where(eq(websiteTemplatesTable.id, id));
    if (!template) return res.status(404).json({ error: "Not found" });
    return res.json(templateToJson(template));
  } catch (err) {
    req.log.error({ err }, "Failed to get website template");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/website-templates/:id", async (req, res) => {
  try {
    const { id } = UpdateWebsiteTemplateParams.parse({ id: Number(req.params.id) });
    const body = UpdateWebsiteTemplateBody.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.price !== undefined) updateData.price = String(body.price);
    if (body.previewUrl !== undefined) updateData.previewUrl = body.previewUrl;
    if (body.screenshotUrl !== undefined) updateData.screenshotUrl = body.screenshotUrl;
    if (body.features !== undefined) updateData.features = body.features;
    if (body.techStack !== undefined) updateData.techStack = body.techStack;
    if (body.deliveryDays !== undefined) updateData.deliveryDays = body.deliveryDays;
    if (body.active !== undefined) updateData.active = body.active;
    if (body.featured !== undefined) updateData.featured = body.featured;
    const [template] = await db.update(websiteTemplatesTable).set(updateData).where(eq(websiteTemplatesTable.id, id)).returning();
    if (!template) return res.status(404).json({ error: "Not found" });
    return res.json(templateToJson(template));
  } catch (err) {
    req.log.error({ err }, "Failed to update website template");
    return res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/website-templates/:id", async (req, res) => {
  try {
    const { id } = DeleteWebsiteTemplateParams.parse({ id: Number(req.params.id) });
    await db.delete(websiteTemplatesTable).where(eq(websiteTemplatesTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete website template");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
