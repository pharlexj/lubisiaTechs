import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListBlogPostsQueryParams,
  ListBlogPostsResponse,
  CreateBlogPostBody,
  GetBlogPostParams,
  GetBlogPostResponse,
  UpdateBlogPostParams,
  UpdateBlogPostBody,
  DeleteBlogPostParams,
} from "@workspace/api-zod";

const router = Router();

function postToJson(p: typeof blogPostsTable.$inferSelect) {
  return {
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

router.get("/blog", async (req, res) => {
  try {
    const query = ListBlogPostsQueryParams.parse(req.query);
    const conditions = [];
    if (query.published !== undefined) conditions.push(eq(blogPostsTable.published, query.published));
    if (query.category) conditions.push(eq(blogPostsTable.category, query.category));
    const posts = await db
      .select()
      .from(blogPostsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(blogPostsTable.createdAt);
    return res.json(ListBlogPostsResponse.parse(posts.map(postToJson)));
  } catch (err) {
    req.log.error({ err }, "Failed to list blog posts");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blog", async (req, res) => {
  try {
    const body = CreateBlogPostBody.parse(req.body);
    const [post] = await db.insert(blogPostsTable).values({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      coverImageUrl: body.coverImageUrl ?? null,
      published: body.published ?? false,
      category: body.category,
      author: body.author ?? null,
    }).returning();
    return res.status(201).json(postToJson(post));
  } catch (err) {
    req.log.error({ err }, "Failed to create blog post");
    return res.status(400).json({ error: "Bad request" });
  }
});

router.get("/blog/:slug", async (req, res) => {
  try {
    const { slug } = GetBlogPostParams.parse({ slug: req.params.slug });
    const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, slug));
    if (!post) return res.status(404).json({ error: "Not found" });
    return res.json(GetBlogPostResponse.parse(postToJson(post)));
  } catch (err) {
    req.log.error({ err }, "Failed to get blog post");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/blog/:slug", async (req, res) => {
  try {
    const { slug } = UpdateBlogPostParams.parse({ slug: req.params.slug });
    const body = UpdateBlogPostBody.parse(req.body);
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.coverImageUrl !== undefined) updateData.coverImageUrl = body.coverImageUrl;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.author !== undefined) updateData.author = body.author;
    const [post] = await db.update(blogPostsTable).set(updateData).where(eq(blogPostsTable.slug, slug)).returning();
    if (!post) return res.status(404).json({ error: "Not found" });
    return res.json(postToJson(post));
  } catch (err) {
    req.log.error({ err }, "Failed to update blog post");
    return res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/blog/:slug", async (req, res) => {
  try {
    const { slug } = DeleteBlogPostParams.parse({ slug: req.params.slug });
    await db.delete(blogPostsTable).where(eq(blogPostsTable.slug, slug));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete blog post");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
