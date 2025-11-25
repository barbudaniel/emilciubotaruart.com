import { cmsDataSchema, type CmsData } from "./schema";
import { defaultCmsData } from "./default-data";
import { createClient } from "@/lib/supabase/server-client";

const siteId = process.env.NEXT_PUBLIC_SUPABASE_SITE_ID ?? "default-site";

export async function loadCmsDataServer(): Promise<CmsData> {
  try {
    const client = await createClient();

    const { data, error } = await client.from("cms_snapshots").select("payload").eq("site_id", siteId).maybeSingle();

    if (error) {
      console.warn("[cms] Snapshot load error", error);
      return defaultCmsData;
    }

    if (!data) {
      await client
        .from("cms_snapshots")
        .upsert({ site_id: siteId, payload: defaultCmsData }, { onConflict: "site_id" });
      return defaultCmsData;
    }

    try {
      return cmsDataSchema.parse(data.payload);
    } catch (err) {
      console.error("[cms] Failed to parse snapshot payload", err);
      return defaultCmsData;
    }
  } catch (error) {
    console.error("[cms] Failed to load CMS data", error);
    return defaultCmsData;
  }
}
