import Link from "next/link";
import {
  UtensilsCrossed,
  Scissors,
  HeartPulse,
  Dumbbell,
  Home,
  BookOpen,
  Briefcase,
  Hand,
  Hammer,
  Car,
  Building2,
  Music,
  Search,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { SearchForm } from "@/components/SearchForm";
import { SectionHeader } from "@/components/SectionHeader";
import { BusinessCard } from "@/components/BusinessCard";
import { FreeListingBanner } from "@/components/OwnerCTA";
import {
  getFeaturedBusinesses,
  getRecentBusinesses,
} from "@/data/businesses";
import { articles } from "@/data/articles";
import { getMainCategories } from "@/data/categories";
import { popularAreas, findRegion } from "@/data/regions";

const iconMap = {
  UtensilsCrossed,
  Scissors,
  HeartPulse,
  Dumbbell,
  Home,
  BookOpen,
  Briefcase,
  Hand,
  Hammer,
  Car,
  Building2,
  Music,
} as const;

export default function HomePage() {
  const featured = getFeaturedBusinesses().slice(0, 6);
  const recent = getRecentBusinesses(6);
  const mainCategories = getMainCategories();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-soft via-white to-white">
        <div className="container-main pt-10 md:pt-16 pb-12 md:pb-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-brand">
                全国対応 / 全業種対応の地域ポータル
              </p>
              <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight text-foreground">
                あなたの街の
                <br className="md:hidden" />
                おすすめが見つかる
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted leading-relaxed">
                飲食、美容、医療、暮らし、ビジネスまで。
                <br />
                全国のお店・会社・施設を、地域とジャンルからかんたん検索。
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
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

            <div className="md:order-2">
              <SearchForm variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* 人気カテゴリ */}
      <section className="container-main py-12 md:py-16">
        <SectionHeader
          title="人気カテゴリから探す"
          description="あらゆる業種に対応。気になるジャンルを選んでみてください。"
          href="/categories"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {mainCategories.map((c) => {
            const Icon =
              iconMap[(c.icon ?? "Briefcase") as keyof typeof iconMap] ||
              Briefcase;
            return (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="card-hover bg-white rounded-2xl border border-border p-4 md:p-5 flex flex-col gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand">
                  <Icon size={20} />
                </div>
                <div className="font-semibold text-foreground text-sm md:text-base">
                  {c.name}
                </div>
                <div className="text-xs text-muted line-clamp-2">
                  {c.description}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 人気エリア */}
      <section className="bg-surface-soft py-12 md:py-16">
        <div className="container-main">
          <SectionHeader
            title="人気エリアから探す"
            description="主要駅・人気エリアからすぐに探せます。"
            href="/areas"
          />
          <div className="flex flex-wrap gap-2 md:gap-3">
            {popularAreas.map((slug) => {
              const area = findRegion(slug);
              if (!area) return null;
              const city = area.parentSlug
                ? findRegion(area.parentSlug)
                : null;
              const pref = city?.parentSlug
                ? findRegion(city.parentSlug)
                : null;
              if (!pref || !city) return null;
              return (
                <Link
                  key={slug}
                  href={`/areas/${pref.slug}/${city.slug}/${area.slug}`}
                  className="px-4 py-2 rounded-full bg-white border border-border text-sm hover:border-brand hover:text-brand transition-colors"
                >
                  {area.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* おすすめ店舗 */}
      <section className="container-main py-12 md:py-16">
        <SectionHeader
          title="おすすめの店舗・企業"
          description="編集部が注目する店舗をピックアップ。"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featured.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      </section>

      {/* 新着掲載 */}
      <section className="bg-surface-soft py-12 md:py-16">
        <div className="container-main">
          <SectionHeader
            title="新着の掲載店舗・企業"
            description="最近掲載された店舗・会社・施設。"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {recent.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        </div>
      </section>

      {/* おすすめ記事 */}
      <section className="container-main py-12 md:py-16">
        <SectionHeader
          title="おすすめ記事"
          description="地域×業種でまとめた特集記事"
          href="/articles"
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
      <section className="container-main pb-12 md:pb-16">
        <FreeListingBanner />
      </section>

      {/* サービスの使い方 */}
      <section className="bg-surface-soft py-12 md:py-16">
        <div className="container-main">
          <SectionHeader
            title="まちセレクトの使い方"
            description="一般のお客様も、事業者の方も、無料でご利用いただけます。"
          />
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                step: "1",
                title: "地域とジャンルで探す",
                text: "都道府県・市区町村・駅エリアと業種から、目的の店舗・会社・施設を見つけられます。",
              },
              {
                step: "2",
                title: "詳しい情報を比較",
                text: "営業時間・料金目安・特徴・公式リンクなどを横断比較。あなたに合った1軒を選べます。",
              },
              {
                step: "3",
                title: "事業者は無料掲載",
                text: "店舗・会社・施設の掲載は無料。写真や紹介文、公式リンクを掲載できます。",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-2xl border border-border p-5 md:p-6"
              >
                <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-bold">
                  {s.step}
                </div>
                <div className="mt-3 font-bold">{s.title}</div>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
