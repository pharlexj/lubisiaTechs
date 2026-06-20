import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
  GetFeaturedProductsResponse,
} from "@workspace/api-zod";

const router = Router();

function productToJson(p: typeof productsTable.$inferSelect) {
  return {
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/products/featured", async (req, res) => {
  try {
    const products = await db.select().from(productsTable).where(eq(productsTable.featured, true)).limit(6);
    const parsed = GetFeaturedProductsResponse.parse(products.map(productToJson));
    return res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Failed to get featured products");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const query = ListProductsQueryParams.parse(req.query);
    const conditions = [];
    if (query.category) conditions.push(eq(productsTable.category, query.category));
    if (query.inStock) conditions.push(eq(productsTable.stock, 0));

    const products = await db
      .select()
      .from(productsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(productsTable.createdAt);

    const parsed = ListProductsResponse.parse(products.map(productToJson));
    return res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const body = CreateProductBody.parse(req.body);
    const [product] = await db.insert(productsTable).values({
      name: body.name,
      description: body.description,
      category: body.category,
      price: String(body.price),
      stock: body.stock,
      imageUrl: body.imageUrl ?? null,
      featured: body.featured ?? false,
    }).returning();
    return res.status(201).json(productToJson(product));
  } catch (err) {
    req.log.error({ err }, "Failed to create product");
    return res.status(400).json({ error: "Bad request" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const { id } = GetProductParams.parse({ id: Number(req.params.id) });
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!product) return res.status(404).json({ error: "Not found" });
    return res.json(productToJson(product));
  } catch (err) {
    req.log.error({ err }, "Failed to get product");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/products/:id", async (req, res) => {
  try {
    const { id } = UpdateProductParams.parse({ id: Number(req.params.id) });
    const body = UpdateProductBody.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.price !== undefined) updateData.price = String(body.price);
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.featured !== undefined) updateData.featured = body.featured;
    const [product] = await db.update(productsTable).set(updateData).where(eq(productsTable.id, id)).returning();
    if (!product) return res.status(404).json({ error: "Not found" });
    return res.json(productToJson(product));
  } catch (err) {
    req.log.error({ err }, "Failed to update product");
    return res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = DeleteProductParams.parse({ id: Number(req.params.id) });
    await db.delete(productsTable).where(eq(productsTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete product");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
