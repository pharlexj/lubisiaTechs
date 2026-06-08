import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListSettingsResponse,
  GetSettingParams,
  GetSettingResponse,
  UpsertSettingParams,
  UpsertSettingBody,
} from "@workspace/api-zod";

const router = Router();

function settingToJson(s: typeof siteSettingsTable.$inferSelect) {
  return { ...s, updatedAt: s.updatedAt.toISOString() };
}

router.get("/settings", async (req, res) => {
  try {
    const settings = await db.select().from(siteSettingsTable).orderBy(siteSettingsTable.group);
    res.json(ListSettingsResponse.parse(settings.map(settingToJson)));
  } catch (err) {
    req.log.error({ err }, "Failed to list settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/settings/:key", async (req, res) => {
  try {
    const { key } = GetSettingParams.parse({ key: req.params.key });
    const [setting] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key));
    if (!setting) return res.status(404).json({ error: "Not found" });
    res.json(GetSettingResponse.parse(settingToJson(setting)));
  } catch (err) {
    req.log.error({ err }, "Failed to get setting");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings/:key", async (req, res) => {
  try {
    const { key } = UpsertSettingParams.parse({ key: req.params.key });
    const body = UpsertSettingBody.parse(req.body);
    const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key));
    let setting;
    if (existing.length > 0) {
      [setting] = await db
        .update(siteSettingsTable)
        .set({ value: body.value, label: body.label, group: body.group, updatedAt: new Date() })
        .where(eq(siteSettingsTable.key, key))
        .returning();
    } else {
      [setting] = await db
        .insert(siteSettingsTable)
        .values({ key, value: body.value, label: body.label, group: body.group })
        .returning();
    }
    res.json(settingToJson(setting));
  } catch (err) {
    req.log.error({ err }, "Failed to upsert setting");
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;
