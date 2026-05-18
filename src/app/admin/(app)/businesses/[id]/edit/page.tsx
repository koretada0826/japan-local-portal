import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { findBusinessById, updateBusiness, deleteBusiness } from "@/lib/businessStore";
import { getMainCategories, getSubCategories } from "@/data/categories";
import { getRegionGroups, getPrefecturesByRegion } from "@/data/regions";
import { BusinessForm } from "@/components/BusinessForm";

type Params = Promise<{ id: string }>;

async function updateBusinessAction(formData: FormData) {
  "use server";
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/businesses");

  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const getArray = (k: string) =>
    get(k)
      .split(/[、,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

  await updateBusiness(id, {
    name: get("name"),
    slug: get("slug") || undefined,
    description: get("description"),
    shortDescription: get("shortDescription"),
    mainImageUrl: get("mainImageUrl") || undefined,
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
    isFeatured: formData.get("isFeatured") === "on",
    isPaid: formData.get("isPaid") === "on",
    isClaimed: formData.get("isClaimed") === "on",
    isPremium: formData.get("isPremium") === "on",
    displayOrder: Number(get("displayOrder") || 100),
  });

  revalidatePath("/admin/businesses");
  revalidatePath("/", "layout");
  redirect("/admin/businesses");
}

async function deleteBusinessAction(formData: FormData) {
  "use server";
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("Unauthorized");
  const id = String(formData.get("id") ?? "");
  if (id) await deleteBusiness(id);
  revalidatePath("/admin/businesses");
  revalidatePath("/", "layout");
  redirect("/admin/businesses");
}

export default async function EditBusinessPage(props: { params: Params }) {
  const { id } = await props.params;
  const business = await findBusinessById(id);
  if (!business) notFound();

  const mainCategories = getMainCategories();
  const subCategoriesAll = mainCategories.flatMap((m) => getSubCategories(m.slug));
  const regionGroups = getRegionGroups();
  const prefectures = regionGroups.flatMap((rg) => getPrefecturesByRegion(rg.slug));

  return (
    <div className="space-y-6">
      <Link
        href="/admin/businesses"
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-brand"
      >
        <ArrowLeft size={12} />
        店舗一覧に戻る
      </Link>
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">店舗を編集</h1>
          <p className="text-sm text-muted mt-1">{business.name}</p>
        </div>
        <form action={deleteBusinessAction}>
          <input type="hidden" name="id" value={business.id} />
          <button
            type="submit"
            className="text-xs px-3 py-2 rounded-xl border border-red-300 text-red-500 hover:bg-red-50"
            // クリック時にブラウザのconfirmは使わない（ダイアログでブラウザ操作止まるため運用上避ける）。
            // 簡易のため即削除。本格運用なら確認用モーダル実装を検討。
          >
            この店舗を削除
          </button>
        </form>
      </header>

      <BusinessForm
        action={async (fd) => {
          "use server";
          fd.set("id", id);
          return updateBusinessAction(fd);
        }}
        submitLabel="保存する"
        mainCategories={mainCategories}
        subCategories={subCategoriesAll}
        prefectures={prefectures}
        initial={business}
      />
    </div>
  );
}
