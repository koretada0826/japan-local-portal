import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SectionHeader } from "@/components/SectionHeader";
import { regions, getPrefectures, getCitiesByPref } from "@/data/regions";

export const metadata: Metadata = {
  title: "地域から探す｜全国のお店・会社・施設",
  description:
    "全国の都道府県・市区町村・駅エリアから、お店・会社・施設を探せます。地域別に整理されたカテゴリで目的のお店がすぐに見つかります。",
};

const regionGroups = [
  { name: "北海道", slug: "hokkaido-region" },
  { name: "東北", slug: "tohoku" },
  { name: "関東", slug: "kanto" },
  { name: "中部", slug: "chubu" },
  { name: "関西", slug: "kansai" },
  { name: "中国", slug: "chugoku" },
  { name: "四国", slug: "shikoku" },
  { name: "九州", slug: "kyushu" },
  { name: "沖縄", slug: "okinawa-region" },
];

export default function AreasIndexPage() {
  return (
    <div className="container-main py-8 md:py-12">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "地域から探す" }]} />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">地域から探す</h1>
      <p className="mt-2 text-sm text-muted">
        全国の都道府県・市区町村・駅エリアから、目的のお店・会社・施設を探せます。
      </p>

      <div className="mt-8 space-y-10">
        {regionGroups.map((g) => {
          const prefs = getPrefectures().filter(
            (p) => p.parentSlug === g.slug
          );
          if (prefs.length === 0) {
            return (
              <section key={g.slug}>
                <SectionHeader title={g.name} />
                <p className="text-sm text-muted-soft">
                  この地方の都道府県は順次掲載予定です。
                </p>
              </section>
            );
          }
          return (
            <section key={g.slug}>
              <SectionHeader title={g.name} />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {prefs.map((p) => {
                  const cities = getCitiesByPref(p.slug);
                  return (
                    <div
                      key={p.slug}
                      className="bg-white rounded-2xl border border-border p-4"
                    >
                      <Link
                        href={`/areas/${p.slug}`}
                        className="font-bold text-foreground hover:text-brand"
                      >
                        {p.name}
                      </Link>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {cities.slice(0, 6).map((c) => (
                          <Link
                            key={c.slug}
                            href={`/areas/${p.slug}/${c.slug}`}
                            className="text-xs px-2 py-1 rounded-full bg-surface-soft border border-border hover:border-brand hover:text-brand"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
