import { Router } from "express";
import { db } from "@workspace/db";
import {
  servicesTable, productsTable, ordersTable, inquiriesTable,
  orderItemsTable, blogPostsTable, affiliateLinksTable,
  usersTable, newsletterSubscribersTable,
} from "@workspace/db";
import { desc, sum, count, eq, sql } from "drizzle-orm";

const router = Router();

router.get("/stats/summary", async (req, res) => {
  try {
    const [services, products] = await Promise.all([
      db.select().from(servicesTable),
      db.select().from(productsTable),
    ]);

    const recentOrders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt))
      .limit(5);

    const recentInquiries = await db
      .select()
      .from(inquiriesTable)
      .orderBy(desc(inquiriesTable.createdAt))
      .limit(5);

    const [
      totalOrdersRow,
      totalInquiriesRow,
      revenueRow,
      blogRow,
      clicksRow,
      usersRow,
      newsletterRow,
    ] = await Promise.all([
      db.select({ count: count() }).from(ordersTable).then(r => r[0]),
      db.select({ count: count() }).from(inquiriesTable).then(r => r[0]),
      db.select({ total: sum(ordersTable.totalAmount) }).from(ordersTable).then(r => r[0]),
      db.select({ count: count() }).from(blogPostsTable).then(r => r[0]),
      db.select({ total: sql<number>`coalesce(sum(${affiliateLinksTable.clicks}), 0)` }).from(affiliateLinksTable).then(r => r[0]),
      db.select({ count: count() }).from(usersTable).then(r => r[0]),
      db.select({ count: count() }).from(newsletterSubscribersTable).then(r => r[0]),
    ]);

    const recentOrdersWithItems = await Promise.all(
      recentOrders.map(async (o) => {
        const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, o.id));
        return {
          ...o,
          totalAmount: Number(o.totalAmount),
          createdAt: o.createdAt.toISOString(),
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: Number(i.unitPrice),
          })),
        };
      })
    );

    res.json({
      totalProducts: products.length,
      totalOrders: Number(totalOrdersRow?.count ?? 0),
      totalInquiries: Number(totalInquiriesRow?.count ?? 0),
      totalServices: services.length,
      totalRevenue: Number(revenueRow?.total ?? 0),
      totalBlogPosts: Number(blogRow?.count ?? 0),
      totalAffiliateClicks: Number(clicksRow?.total ?? 0),
      totalUsers: Number(usersRow?.count ?? 0),
      totalNewsletterSubscribers: Number(newsletterRow?.count ?? 0),
      recentOrders: recentOrdersWithItems,
      recentInquiries: recentInquiries.map((i) => ({ ...i, createdAt: i.createdAt.toISOString() })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
