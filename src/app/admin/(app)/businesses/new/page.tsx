import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { appendBusiness } from "@/lib/businessStore";
import { getMainCategories, getSubCategories } from "@/data/categories";
import { getRegionGroups, getPrefecturesByRegion } from "@/data/regions";
import { BusinessForm } from "@/components/BusinessForm";

async function createBusinessAction(formData: FormData) {
  "use server";
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("Unauthorized");

  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const getArray = (k: string) =>
    get(k)
      .split(/[、,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

  const name = get("name");
  const slug =
    get("slug") ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
      "-" +
      Math.random().toString(36).slice(2, 8);

  const result = await appendBusiness({
    name,
    slug,
    description: get("description"),
    shortDescription: get("shortDescription"),
    mainImageUrl:
      get("mainImageUrl") || `https://picsum.photos/seed/${slug}/800/600`,
    prefectureSlug: get("prefectureSlug"),
    citySlug: get("citySlug"),
    areaSlug: get("areaSlug") || get("citySlug") || get("prefectureSlug"),
    mainCategorySlug: get("mainCategorySlug"),
    subCategorySlug: get("subCategorySlug"),
    address: get("address"),
    phone: get("phone") || undefined,
    businessHours: get("businessHours") || undefined,
    regularHoliday: get("regularHoliday") || undefined,
    priceRange: get("priceRange") || undefined,
    websiteUrl: get("websiteUrl") || undefined,
    instagramUrl: get("instagramUrl") || undefined,
    googleMapUrl: get("googleMapUrl") || undefined,
    features: getArray("features"),
    recommendPoints: getArray("recommendPoints"),
    services: getArray("services"),
    status: "published",
    isFeatured: formData.get("isFeatured") === "on",
    isPaid: formData.get("isPaid") === "on",
    isClaimed: formData.get("isClaimed") === "on",
    isPremium: formData.get("isPremium") === "on",
    displayOrder: Number(get("displayOrder") || 100),
  });

  if (!result) {
    redirect("/admin/businesses?error=create_failed");
  }
  revalidatePath("/admin/businesses");
  revalidatePath("/", "layout");
  redirect("/admin/businesses");
}

export default async function NewBusinessPage() {
  const mainCategories = getMainCategories();
  const subCategoriesAll = mainCategories.flatMap((m) =>
    getSubCategories(m.slug)
  );
  const regionGroups = getRegionGroups();
  const prefectures = regionGroups.flatMap((rg) =>
    getPrefecturesByRegion(rg.slug)
  );

  return (
    <div className="space-y-6">
      <Link
        href="/admin/businesses"
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-brand"
      >
        <ArrowLeft size={12} />
        店舗一覧に戻る
      </Link>
      <header>
        <h1 className="text-2xl font-bold">新規店舗の追加</h1>
        <p className="text-sm text-muted mt-1">
          公開する店舗・会社・施設の情報を入力してください。
        </p>
      </header>

      <BusinessForm
        action={createBusinessAction}
        submitLabel="登録する"
        mainCategories={mainCategories}
        subCategories={subCategoriesAll}
        prefectures={prefectures}
      />
    </div>
  );
}
