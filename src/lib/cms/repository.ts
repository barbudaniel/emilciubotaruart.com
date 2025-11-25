import { cmsDataSchema, defaultCmsData, type CmsData } from "@/lib/cms";
import { getSupabaseClient } from "@/lib/supabase/client";

export interface CmsRepository {
  load(): Promise<CmsData>;
  save(data: CmsData): Promise<void>;
  reset(): Promise<CmsData>;
}

const CMS_TABLE = "cms_snapshots";
const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SUPABASE_SITE_ID ?? "default-site";

class SupabaseCmsRepository implements CmsRepository {
  private siteId = DEFAULT_SITE_ID;

  private get client() {
    return getSupabaseClient();
  }

  async load() {
    const client = this.client;
    if (!client) {
      console.warn("[SupabaseCmsRepository] Supabase client missing. Falling back to defaults.");
      return defaultCmsData;
    }

    const { data, error } = await client.from(CMS_TABLE).select("payload").eq("site_id", this.siteId).single();

    if (error || !data) {
      if (error?.code !== "PGRST116") {
        console.warn("[SupabaseCmsRepository] load error", error);
      }
      return defaultCmsData;
    }

    return cmsDataSchema.parse(data.payload);
  }

  async save(data: CmsData) {
    const client = this.client;
    if (!client) {
      return;
    }

    const payload = cmsDataSchema.parse(data);
    const { error } = await client
      .from(CMS_TABLE)
      .upsert(
        {
          site_id: this.siteId,
          payload,
        },
        { onConflict: "site_id" },
      );

    if (error) {
      console.error("[SupabaseCmsRepository] save error", error);
    }
  }

  async reset() {
    const client = this.client;
    if (client) {
      const { error } = await client.from(CMS_TABLE).upsert({
        site_id: this.siteId,
        payload: defaultCmsData,
      });
      if (error) {
        console.error("[SupabaseCmsRepository] reset error", error);
      }
    }
    return defaultCmsData;
  }
}

export function createCmsRepository(): CmsRepository {
  return new SupabaseCmsRepository();
}
