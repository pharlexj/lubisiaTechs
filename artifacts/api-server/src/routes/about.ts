import { Router } from "express";
import { db } from "@workspace/db";
import { aboutSectionsTable, teamMembersTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

function sectionToJson(s: typeof aboutSectionsTable.$inferSelect) {
  return { ...s, updatedAt: s.updatedAt.toISOString() };
}
function memberToJson(m: typeof teamMembersTable.$inferSelect) {
  return { ...m, createdAt: m.createdAt.toISOString() };
}

// ── About Sections ────────────────────────────────────────────────────────────

router.get("/about", async (req, res) => {
  try {
    const sections = await db
      .select()
      .from(aboutSectionsTable)
      .orderBy(asc(aboutSectionsTable.displayOrder));
    res.json(sections.map(sectionToJson));
  } catch (err) {
    req.log.error({ err }, "Failed to list about sections");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/about/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const { title, content, displayOrder } = req.body as {
      title: string;
      content: string;
      displayOrder?: number;
    };
    if (!title || !content) {
      res.status(400).json({ error: "title and content are required" });
      return;
    }
    const existing = await db
      .select()
      .from(aboutSectionsTable)
      .where(eq(aboutSectionsTable.key, key));
    let section;
    if (existing.length > 0) {
      [section] = await db
        .update(aboutSectionsTable)
        .set({ title, content, displayOrder: displayOrder ?? existing[0].displayOrder, updatedAt: new Date() })
        .where(eq(aboutSectionsTable.key, key))
        .returning();
    } else {
      [section] = await db
        .insert(aboutSectionsTable)
        .values({ key, title, content, displayOrder: displayOrder ?? 0 })
        .returning();
    }
    res.json(sectionToJson(section));
  } catch (err) {
    req.log.error({ err }, "Failed to upsert about section");
    res.status(400).json({ error: "Bad request" });
  }
});

// ── Team Members ──────────────────────────────────────────────────────────────

router.get("/team", async (req, res) => {
  try {
    const members = await db
      .select()
      .from(teamMembersTable)
      .orderBy(asc(teamMembersTable.displayOrder));
    res.json(members.map(memberToJson));
  } catch (err) {
    req.log.error({ err }, "Failed to list team members");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/team", async (req, res) => {
  try {
    const { name, role, bio, photoUrl, linkedIn, displayOrder, active } =
      req.body as {
        name: string;
        role: string;
        bio?: string;
        photoUrl?: string | null;
        linkedIn?: string | null;
        displayOrder?: number;
        active?: number;
      };
    if (!name || !role) {
      res.status(400).json({ error: "name and role are required" });
      return;
    }
    const [member] = await db
      .insert(teamMembersTable)
      .values({
        name,
        role,
        bio: bio ?? "",
        photoUrl: photoUrl ?? null,
        linkedIn: linkedIn ?? null,
        displayOrder: displayOrder ?? 0,
        active: active ?? 1,
      })
      .returning();
    res.status(201).json(memberToJson(member));
  } catch (err) {
    req.log.error({ err }, "Failed to create team member");
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/team/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, role, bio, photoUrl, linkedIn, displayOrder, active } =
      req.body as {
        name?: string;
        role?: string;
        bio?: string;
        photoUrl?: string | null;
        linkedIn?: string | null;
        displayOrder?: number;
        active?: number;
      };
    const [existing] = await db
      .select()
      .from(teamMembersTable)
      .where(eq(teamMembersTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const [member] = await db
      .update(teamMembersTable)
      .set({
        name: name ?? existing.name,
        role: role ?? existing.role,
        bio: bio ?? existing.bio,
        photoUrl: photoUrl !== undefined ? photoUrl : existing.photoUrl,
        linkedIn: linkedIn !== undefined ? linkedIn : existing.linkedIn,
        displayOrder: displayOrder ?? existing.displayOrder,
        active: active ?? existing.active,
      })
      .where(eq(teamMembersTable.id, id))
      .returning();
    res.json(memberToJson(member));
  } catch (err) {
    req.log.error({ err }, "Failed to update team member");
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/team/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(teamMembersTable).where(eq(teamMembersTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete team member");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
