import { Router } from "express";
import { db } from "@workspace/db";
import { servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListServicesResponse,
  CreateServiceBody,
  GetServiceParams,
  UpdateServiceParams,
  UpdateServiceBody,
  DeleteServiceParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/services", async (req, res) => {
  try {
    const services = await db.select().from(servicesTable).orderBy(servicesTable.createdAt);
    const parsed = ListServicesResponse.parse(
      services.map((s) => ({
        ...s,
        price: s.price !== null ? Number(s.price) : null,
        createdAt: s.createdAt.toISOString(),
      }))
    );
    return res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Failed to list services");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/services", async (req, res) => {
  try {
    const body = CreateServiceBody.parse(req.body);
    const [service] = await db.insert(servicesTable).values({
      name: body.name,
      description: body.description,
      category: body.category,
      price: body.price !== null && body.price !== undefined ? String(body.price) : null,
      imageUrl: body.imageUrl ?? null,
      featured: body.featured ?? false,
    }).returning();
    return res.status(201).json({
      ...service,
      price: service.price !== null ? Number(service.price) : null,
      createdAt: service.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create service");
    return res.status(400).json({ error: "Bad request" });
  }
});

router.get("/services/:id", async (req, res) => {
  try {
    const { id } = GetServiceParams.parse({ id: Number(req.params.id) });
    const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, id));
    if (!service) return res.status(404).json({ error: "Not found" });
    return res.json({
      ...service,
      price: service.price !== null ? Number(service.price) : null,
      createdAt: service.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get service");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/services/:id", async (req, res) => {
  try {
    const { id } = UpdateServiceParams.parse({ id: Number(req.params.id) });
    const body = UpdateServiceBody.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.price !== undefined) updateData.price = body.price !== null ? String(body.price) : null;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.featured !== undefined) updateData.featured = body.featured;
    const [service] = await db.update(servicesTable).set(updateData).where(eq(servicesTable.id, id)).returning();
    if (!service) return res.status(404).json({ error: "Not found" });
    return res.json({
      ...service,
      price: service.price !== null ? Number(service.price) : null,
      createdAt: service.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update service");
    return res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/services/:id", async (req, res) => {
  try {
    const { id } = DeleteServiceParams.parse({ id: Number(req.params.id) });
    await db.delete(servicesTable).where(eq(servicesTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete service");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
