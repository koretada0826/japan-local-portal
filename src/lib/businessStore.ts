import { randomUUID } from "crypto";
import type { Business, BusinessStatus } from "@/types";
import { businesses as staticBusinesses } from "@/data/businesses";
import { supabaseAdmin, isSupabaseAvailable } from "./supabaseServer";

// ─── Supabase行 ⇄ Business型 変換ヘルパー ───
type BusinessRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  main_image_url: string | null;
  address: string | null;
  phone: string | null;
  business_hours: string | null;
  regular_holiday: string | null;
  price_range: string | null;
  website_url: string | null;
  instagram_url: string | null;
  x_url: string | null;
  line_url: string | null;
  google_map_url: string | null;
  features: string[] | null;
  recommend_points: string[] | null;
  services: string[] | null;
  status: BusinessStatus;
  is_featured: boolean;
  is_paid: boolean;
  is_claimed: boolean;
  is_premium: boolean;
  display_order: number;
  created_at: string;
  // 追加メタデータ列（コラム未対応分はjsonbで保管）
  prefecture_slug?: string | null;
  city_slug?: string | null;
  area_slug?: string | null;
  main_category_slug?: string | null;
  sub_category_slug?: string | null;
};

function rowToBusiness(r: BusinessRow): Business {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description ?? "",
    shortDescription: r.short_description ?? "",
    mainImageUrl:
      r.main_image_url ?? `https://picsum.photos/seed/${r.slug}/800/600`,
    prefectureSlug: r.prefecture_slug ?? "",
    citySlug: r.city_slug ?? "",
    areaSlug: r.area_slug ?? "",
    mainCategorySlug: r.main_category_slug ?? "",
    subCategorySlug: r.sub_category_slug ?? "",
    address: r.address ?? "",
    phone: r.phone ?? undefined,
    businessHours: r.business_hours ?? undefined,
    regularHoliday: r.regular_holiday ?? undefined,
    priceRange: r.price_range ?? undefined,
    websiteUrl: r.website_url ?? undefined,
    instagramUrl: r.instagram_url ?? undefined,
    xUrl: r.x_url ?? undefined,
    lineUrl: r.line_url ?? undefined,
    googleMapUrl: r.google_map_url ?? undefined,
    features: r.features ?? [],
    recommendPoints: r.recommend_points ?? [],
    services: r.services ?? undefined,
    status: r.status,
    isFeatured: r.is_featured,
    isPaid: r.is_paid,
    isClaimed: r.is_claimed,
    isPremium: r.is_premium,
    displayOrder: r.display_order,
    createdAt: r.created_at,
  };
}

function businessToRow(b: Partial<Business>): Partial<BusinessRow> {
  return {
    ...(b.name !== undefined && { name: b.name }),
    ...(b.slug !== undefined && { slug: b.slug }),
    ...(b.description !== undefined && { description: b.description }),
    ...(b.shortDescription !== undefined && { short_description: b.shortDescription }),
    ...(b.mainImageUrl !== undefined && { main_image_url: b.mainImageUrl }),
    ...(b.address !== undefined && { address: b.address }),
    ...(b.phone !== undefined && { phone: b.phone ?? null }),
    ...(b.businessHours !== undefined && { business_hours: b.businessHours ?? null }),
    ...(b.regularHoliday !== undefined && { regular_holiday: b.regularHoliday ?? null }),
    ...(b.priceRange !== undefined && { price_range: b.priceRange ?? null }),
    ...(b.websiteUrl !== undefined && { website_url: b.websiteUrl ?? null }),
    ...(b.instagramUrl !== undefined && { instagram_url: b.instagramUrl ?? null }),
    ...(b.xUrl !== undefined && { x_url: b.xUrl ?? null }),
    ...(b.lineUrl !== undefined && { line_url: b.lineUrl ?? null }),
    ...(b.googleMapUrl !== undefined && { google_map_url: b.googleMapUrl ?? null }),
    ...(b.features !== undefined && { features: b.features }),
    ...(b.recommendPoints !== undefined && { recommend_points: b.recommendPoints }),
    ...(b.services !== undefined && { services: b.services ?? null }),
    ...(b.status !== undefined && { status: b.status }),
    ...(b.isFeatured !== undefined && { is_featured: b.isFeatured }),
    ...(b.isPaid !== undefined && { is_paid: b.isPaid }),
    ...(b.isClaimed !== undefined && { is_claimed: b.isClaimed }),
    ...(b.isPremium !== undefined && { is_premium: b.isPremium }),
    ...(b.displayOrder !== undefined && { display_order: b.displayOrder }),
    ...(b.prefectureSlug !== undefined && { prefecture_slug: b.prefectureSlug }),
    ...(b.citySlug !== undefined && { city_slug: b.citySlug }),
    ...(b.areaSlug !== undefined && { area_slug: b.areaSlug }),
    ...(b.mainCategorySlug !== undefined && { main_category_slug: b.mainCategorySlug }),
    ...(b.subCategorySlug !== undefined && { sub_category_slug: b.subCategorySlug }),
  };
}

/**
 * 全店舗を取得（静的データ + Supabase）
 * - 静的データ: src/data/businesses.ts に書かれた既存のデモ店舗
 * - DBデータ: 管理画面から後で追加された店舗
 * - 同じslugがあればDB優先（編集された証）
 */
export async function readAllBusinesses(): Promise<Business[]> {
  const dbBusinesses: Business[] = [];

  if (isSupabaseAvailable && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("businesses")
      .select("*")
      .order("display_order", { ascending: true });
    if (!error && data) {
      dbBusinesses.push(...(data as BusinessRow[]).map(rowToBusiness));
    } else if (error) {
      console.warn("[businessStore] supabase read failed:", error.message);
    }
  }

  // 静的 + DB をマージ。同じslugはDB優先
  const dbSlugs = new Set(dbBusinesses.map((b) => b.slug));
  const merged = [
    ...dbBusinesses,
    ...staticBusinesses.filter((b) => !dbSlugs.has(b.slug)),
  ];
  return merged;
}

/**
 * slugで1件取得
 */
export async function findBusinessBySlug(slug: string): Promise<Business | null> {
  if (isSupabaseAvailable && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("businesses")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (!error && data) return rowToBusiness(data as BusinessRow);
  }
  return staticBusinesses.find((b) => b.slug === slug) ?? null;
}

/**
 * idで1件取得
 */
export async function findBusinessById(id: string): Promise<Business | null> {
  if (isSupabaseAvailable && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("businesses")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) return rowToBusiness(data as BusinessRow);
  }
  return staticBusinesses.find((b) => b.id === id) ?? null;
}

/**
 * 新規店舗追加（Supabase必須）
 */
export async function appendBusiness(
  data: Omit<Business, "id" | "createdAt">
): Promise<Business | null> {
  if (!isSupabaseAvailable || !supabaseAdmin) {
    console.warn("[businessStore] Supabase未接続のため店舗追加は不可");
    return null;
  }
  const row = businessToRow({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...data,
  });
  const { data: inserted, error } = await supabaseAdmin
    .from("businesses")
    .insert(row)
    .select()
    .single();
  if (error) {
    console.warn("[businessStore] insert failed:", error.message);
    return null;
  }
  return rowToBusiness(inserted as BusinessRow);
}

/**
 * 店舗を更新（Supabaseのみ。静的データは更新不可）
 */
export async function updateBusiness(
  id: string,
  patch: Partial<Business>
): Promise<Business | null> {
  if (!isSupabaseAvailable || !supabaseAdmin) {
    console.warn("[businessStore] Supabase未接続のため更新不可");
    return null;
  }
  const row = businessToRow(patch);
  const { data, error } = await supabaseAdmin
    .from("businesses")
    .update(row)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.warn("[businessStore] update failed:", error.message);
    return null;
  }
  return data ? rowToBusiness(data as BusinessRow) : null;
}

/**
 * 店舗を削除（Supabaseのみ）
 */
export async function deleteBusiness(id: string): Promise<boolean> {
  if (!isSupabaseAvailable || !supabaseAdmin) {
    console.warn("[businessStore] Supabase未接続のため削除不可");
    return false;
  }
  const { error } = await supabaseAdmin.from("businesses").delete().eq("id", id);
  if (error) {
    console.warn("[businessStore] delete failed:", error.message);
    return false;
  }
  return true;
}

/**
 * 静的＋DBから検索キーワード/フィルタで絞り込み
 */
export async function searchBusinessesMerged(filters: {
  q?: string;
  prefectureSlug?: string;
  citySlug?: string;
  areaSlug?: string;
  mainCategorySlug?: string;
  subCategorySlug?: string;
  sort?: "recommend" | "new";
}): Promise<Business[]> {
  const all = await readAllBusinesses();
  const q = (filters.q ?? "").trim().toLowerCase();
  const results = all.filter((b) => {
    if (b.status !== "published") return false;
    if (filters.prefectureSlug && b.prefectureSlug !== filters.prefectureSlug) return false;
    if (filters.citySlug && b.citySlug !== filters.citySlug) return false;
    if (filters.areaSlug && b.areaSlug !== filters.areaSlug) return false;
    if (filters.mainCategorySlug && b.mainCategorySlug !== filters.mainCategorySlug) return false;
    if (filters.subCategorySlug && b.subCategorySlug !== filters.subCategorySlug) return false;
    if (q) {
      const hay = [
        b.name,
        b.shortDescription,
        b.description,
        b.address,
        ...b.features,
        ...(b.services ?? []),
      ].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (filters.sort === "new") {
    results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else {
    results.sort((a, b) => {
      if (a.isPremium !== b.isPremium) return a.isPremium ? -1 : 1;
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return a.displayOrder - b.displayOrder;
    });
  }
  return results;
}
