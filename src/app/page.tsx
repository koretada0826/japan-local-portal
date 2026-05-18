import Link from "next/link";
import { Search, ShieldCheck, Globe } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { FreeListingBanner } from "@/components/OwnerCTA";
import { HomeSearchForm } from "@/components/HomeSearchForm";
import {
  getPrefecturesByRegion,
  getRegionGroups,
} from "@/data/regions";
import { categories, getMainCategories } from "@/data/categories";
import { articles } from "@/data/articles";

export default function HomePage() {
  const regionGroups = getRegionGroups();
  const mainCategories = getMainCategories();
  const subCategories = categories.filter((c) => c.level === "sub");
  const prefectures = regionGroups.map((rg) => ({
    regionName: rg.name,
    regionSlug: rg.slug,
    items: getPrefecturesByRegion(rg.slug),
  }));

  return (
    <>
      {/* Hero — ブランドタグライン */}
      <section className="bg-gradient-to-b from-brand-soft via-white to-white">
        <div className="container-main pt-8 md:pt-12 pb-6 md:pb-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-brand">
              全国対応 / 全業種対応の地域ポータル
            </p>
            <h1 className="mt-2 text-2xl md:text-4xl font-bold leading-tight text-foreground">
              あなたの街のおすすめが見つかる
            </h1>
            <p className="mt-3 text-sm md:text-base text-muted leading-relaxed">
              飲食、美容、医療、暮らし、ビジネスまで。全国のお店・会社・施設を、キーワード・地域・業種からかんたん検索。
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {[
                { icon: ShieldCheck, label: "掲載無料" },
                { icon: Globe, label: "全国対応" },
                { icon: Search, label: "多業種に対応" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border text-muted"
                >
                  <Icon size={14} className="text-brand" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container-main pb-12">
        {/* 検索フォーム（GET送信で /search に飛ばす） */}
        <HomeSearchForm
          prefectures={prefectures}
          mainCategories={mainCategories}
          subCategories={subCategories}
        />

        {/* 人気の検索条件 */}
        <section className="mt-10">
          <SectionHeader
            title="人気の検索条件"
            description="クリックすると即座に検索結果が表示されます"
          />
          <div className="flex flex-wrap gap-2">
            {[
              { label: "渋谷 美容室", pref: "tokyo", main: "beauty", sub: "hair-salon" },
              { label: "池袋 カフェ", pref: "tokyo", main: "food", sub: "cafe" },
              { label: "新宿 税理士", pref: "tokyo", main: "professional", sub: "zeirishi" },
              { label: "横浜 歯医者", pref: "kanagawa", main: "medical", sub: "dentist" },
              { label: "梅田 ラーメン", pref: "osaka", main: "food", sub: "ramen" },
              { label: "天神 Web制作", pref: "fukuoka", main: "btob", sub: "web" },
              { label: "札幌 メンズ脱毛", pref: "hokkaido", main: "beauty", sub: "mens-hair-removal" },
              { label: "名古屋 パーソナルジム", pref: "aichi", main: "fitness", sub: "personal-gym" },
            ].map((t) => (
              <Link
                key={t.label}
                href={buildHref(t)}
                className="px-3 py-1.5 rounded-full bg-white border border-border text-sm hover:border-brand hover:text-brand"
              >
                {t.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 text-sm text-muted">
            一覧から眺めたい方は{" "}
            <Link href="/areas" className="text-brand hover:underline">
              地域から探す
            </Link>{" "}
            ／{" "}
            <Link href="/categories" className="text-brand hover:underline">
              業種から探す
            </Link>{" "}
            もご利用ください。
          </div>
        </section>

        {/* おすすめ記事 */}
        <section className="mt-12">
          <SectionHeader
            title="おすすめ記事"
            description="地域×業種でまとめた特集記事"
            href="/articles"
            hrefLabel="記事一覧"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.slug}`}
                className="card-hover bg-white rounded-2xl border border-border overflow-hidden"
              >
                <div
                  className="aspect-[16/9] bg-cover bg-center"
                  style={{ backgroundImage: `url(${a.mainImageUrl})` }}
                />
                <div className="p-4 md:p-5">
                  <h3 className="font-bold text-foreground line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted line-clamp-2">
                    {a.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 事業者向けCTA */}
        <section className="mt-14">
          <FreeListingBanner />
        </section>
      </div>
    </>
  );
}

function buildHref(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && v.length > 0) sp.set(k, v);
  });
  const qs = sp.toString();
  return `/search${qs ? `?${qs}` : ""}`;
}
