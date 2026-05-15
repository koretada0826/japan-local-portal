import type { Metadata } from "next";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BusinessCard } from "@/components/BusinessCard";
import { SectionHeader } from "@/components/SectionHeader";
import { FreeListingBanner } from "@/components/OwnerCTA";
import { searchBusinesses } from "@/lib/search";
import {
  findRegion,
  getPrefecturesByRegion,
  getRegionGroups,
} from "@/data/regions";
import {
  getMainCategories,
  getSubCategories,
  findCategory,
  findCategoryByParent,
} from "@/data/categories";
import { articles } from "@/data/articles";

type SearchParams = Promise<{
  q?: string;
  pref?: string;
  main?: string;
  sub?: string;
  sort?: "recommend" | "new";
}>;

export const metadata: Metadata = {
  title: "検索",
  description:
    "全国のお店・会社・施設を、キーワード・地域・業種から検索できます。",
  robots: { index: true, follow: true },
};

export default async function SearchPage(props: {
  searchParams: SearchParams;
}) {
  const sp = await props.searchParams;
  const q = sp.q?.trim() ?? "";
  const pref = sp.pref ?? "";
  const main = sp.main ?? "";
  const sub = sp.sub ?? "";
  const sort = sp.sort ?? "recommend";

  const hasAnyFilter = Boolean(q || pref || main || sub);

  const results = hasAnyFilter
    ? searchBusinesses({
        q,
        prefectureSlug: pref || undefined,
        mainCategorySlug: main || undefined,
        subCategorySlug: sub || undefined,
        sort,
      })
    : [];

  const prefRegion = pref ? findRegion(pref) : null;
  const mainCat = main ? findCategory(main) : null;
  const subCat = main && sub ? findCategoryByParent(sub, main) : null;
  const regionGroups = getRegionGroups();
  const mainCategories = getMainCategories();
  const subCategories = main ? getSubCategories(main) : [];

  return (
    <div className="container-main py-8 md:py-12">
      <Breadcrumb
        items={[{ href: "/", label: "ホーム" }, { label: "検索" }]}
      />

      <div className="mt-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          {hasAnyFilter ? "検索結果" : "検索"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          キーワード、都道府県、業種から、お店・会社・施設を絞り込めます。
        </p>
      </div>

      {/* 検索フォーム（GETでサーバー絞り込み） */}
      <form
        action="/search"
        method="get"
        className="mt-6 bg-white border border-border rounded-2xl p-4 md:p-5 shadow-sm"
      >
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-muted mb-1">
              キーワード
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft"
              />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="例：池袋 カフェ / 渋谷 美容室"
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-muted mb-1">
              都道府県
            </label>
            <select
              name="pref"
              defaultValue={pref}
              className="w-full px-3 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="">全国</option>
              {regionGroups.map((rg) => {
                const prefs = getPrefecturesByRegion(rg.slug);
                if (prefs.length === 0) return null;
                return (
                  <optgroup key={rg.slug} label={rg.name}>
                    {prefs.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-muted mb-1">
              大カテゴリ
            </label>
            <select
              name="main"
              defaultValue={main}
              className="w-full px-3 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="">すべて</option>
              {mainCategories.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-muted mb-1">
              中カテゴリ
            </label>
            <select
              name="sub"
              defaultValue={sub}
              disabled={!main}
              className="w-full px-3 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-surface-soft disabled:text-muted-soft"
            >
              <option value="">すべて</option>
              {subCategories.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-soft">
            中カテゴリは大カテゴリを選ぶと有効になります
          </div>
          <div className="flex gap-2">
            {hasAnyFilter && (
              <Link
                href="/search"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-border bg-white text-sm hover:border-brand text-muted"
              >
                <X size={14} />
                条件クリア
              </Link>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-hover"
            >
              <Search size={14} />
              この条件で検索
            </button>
          </div>
        </div>
      </form>

      {/* 現在の絞り込み表示 */}
      {hasAnyFilter && (
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted">現在の絞り込み:</span>
          {q && (
            <FilterChip label={`「${q}」`} clearHref={buildHref({ pref, main, sub, sort })} />
          )}
          {prefRegion && (
            <FilterChip
              label={prefRegion.name}
              clearHref={buildHref({ q, main, sub, sort })}
            />
          )}
          {mainCat && (
            <FilterChip
              label={mainCat.name}
              clearHref={buildHref({ q, pref, sort })}
            />
          )}
          {subCat && (
            <FilterChip
              label={subCat.name}
              clearHref={buildHref({ q, pref, main, sort })}
            />
          )}
        </div>
      )}

      {/* 結果 */}
      {hasAnyFilter ? (
        <section className="mt-8">
          <div className="flex items-end justify-between gap-3 mb-4">
            <div className="text-sm text-foreground font-semibold">
              {results.length} 件見つかりました
            </div>
            <div className="text-xs flex items-center gap-2">
              <span className="text-muted">並び順:</span>
              <Link
                href={buildHref({ q, pref, main, sub, sort: "recommend" })}
                className={`px-2 py-1 rounded-full border ${
                  sort === "recommend"
                    ? "bg-brand text-white border-brand"
                    : "bg-white border-border text-muted"
                }`}
              >
                おすすめ
              </Link>
              <Link
                href={buildHref({ q, pref, main, sub, sort: "new" })}
                className={`px-2 py-1 rounded-full border ${
                  sort === "new"
                    ? "bg-brand text-white border-brand"
                    : "bg-white border-border text-muted"
                }`}
              >
                新着順
              </Link>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="bg-surface-soft border border-border rounded-2xl p-8 text-center">
              <p className="text-sm text-muted">
                条件に合う店舗・会社が見つかりませんでした。
              </p>
              <p className="text-xs text-muted-soft mt-2">
                キーワードを変更するか、都道府県や業種の絞り込みを外してみてください。
              </p>
              <Link
                href="/search"
                className="mt-4 inline-flex px-4 py-2 rounded-xl border border-border bg-white text-sm hover:border-brand"
              >
                条件を全てクリア
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {results.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>
          )}
        </section>
      ) : (
        // 検索前：人気検索ワードのチップだけ表示（一覧表示は /areas /categories に集約）
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

          <div className="mt-8 text-sm text-muted">
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

          {/* おすすめ記事 */}
          <div className="mt-12">
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
          </div>
        </section>
      )}

      <section className="mt-14">
        <FreeListingBanner />
      </section>
    </div>
  );
}

function FilterChip({
  label,
  clearHref,
}: {
  label: string;
  clearHref: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-soft text-brand">
      {label}
      <Link
        href={clearHref}
        aria-label="この絞り込みを解除"
        className="text-brand/70 hover:text-brand"
      >
        <X size={12} />
      </Link>
    </span>
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
