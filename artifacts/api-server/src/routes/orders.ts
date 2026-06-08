import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListOrdersQueryParams,
  ListOrdersResponse,
  CreateOrderBody,
  GetOrderParams,
  UpdateOrderParams,
  UpdateOrderBody,
  TrackOrderQueryParams,
} from "@workspace/api-zod";
import { sendNewOrderAlert, sendOrderConfirmation } from "../lib/email";

const router = Router();

async function getOrderWithItems(id: number) {
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
  if (!order) return null;
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id));
  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    items: items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
    })),
  };
}

// Public order tracking — must come before /orders/:id
router.get("/orders/track", async (req, res) => {
  try {
    const { orderId, email } = TrackOrderQueryParams.parse({
      orderId: Number(req.query.orderId),
      email: req.query.email,
    });
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(and(eq(ordersTable.id, orderId), eq(ordersTable.customerEmail, email.toLowerCase())));
    if (!order) return res.status(404).json({ error: "Order not found" });
    const full = await getOrderWithItems(order.id);
    res.json(full);
  } catch (err) {
    req.log.error({ err }, "Failed to track order");
    res.status(400).json({ error: "Bad request" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const query = ListOrdersQueryParams.parse(req.query);
    let allOrders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    if (query.status) {
      allOrders = allOrders.filter((o) => o.status === query.status);
    }
    const result = await Promise.all(allOrders.map((o) => getOrderWithItems(o.id)));
    const parsed = ListOrdersResponse.parse(result.filter(Boolean));
    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Failed to list orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const body = CreateOrderBody.parse(req.body);
    const items = body.items as { productId: number; quantity: number; unitPrice: number }[];
    const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

    const [order] = await db.insert(ordersTable).values({
      customerName: body.customerName,
      customerEmail: body.customerEmail.toLowerCase(),
      customerPhone: body.customerPhone ?? null,
      notes: body.notes ?? null,
      totalAmount: String(totalAmount),
      status: "pending",
    }).returning();

    await db.insert(orderItemsTable).values(
      items.map((i) => ({
        orderId: order.id,
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: String(i.unitPrice),
      }))
    );

    const full = await getOrderWithItems(order.id);

    // Fire-and-forget email alerts
    sendNewOrderAlert({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      totalAmount,
      items,
    }).catch(() => {});

    sendOrderConfirmation({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      totalAmount,
    }).catch(() => {});

    res.status(201).json(full);
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(400).json({ error: "Bad request" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = GetOrderParams.parse({ id: Number(req.params.id) });
    const order = await getOrderWithItems(id);
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(order);
  } catch (err) {
    req.log.error({ err }, "Failed to get order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/orders/:id", async (req, res) => {
  try {
    const { id } = UpdateOrderParams.parse({ id: Number(req.params.id) });
    const body = UpdateOrderBody.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;
    const [updated] = await db.update(ordersTable).set(updateData).where(eq(ordersTable.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    const full = await getOrderWithItems(id);
    res.json(full);
  } catch (err) {
    req.log.error({ err }, "Failed to update order");
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;
