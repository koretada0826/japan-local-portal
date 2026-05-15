import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  getMainCategories,
  getSubCategories,
} from "@/data/categories";

export const metadata: Metadata = {
  title: "業種から探す｜あらゆる業種のお店・会社・施設",
  description:
    "飲食店・美容・医療・士業・介護・住宅・法人向けサービスまで、あらゆる業種から探せます。お住まいの地域でぴったりのお店を見つけてください。",
};

export default function CategoriesIndexPage() {
  const mains = getMainCategories();

  return (
    <div className="container-main py-8 md:py-12">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "業種から探す" }]} />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">業種から探す</h1>
      <p className="mt-2 text-sm text-muted">
        飲食店から法人向けサービスまで、あらゆる業種からお店・会社・施設を探せます。
      </p>

      <div className="mt-8 space-y-10">
        {mains.map((m) => {
          const subs = getSubCategories(m.slug);
          return (
            <section key={m.slug}>
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold">
                  <Link
                    href={`/categories/${m.slug}`}
                    className="hover:text-brand"
                  >
                    {m.name}
                  </Link>
                </h2>
                <Link
                  href={`/categories/${m.slug}`}
                  className="text-xs text-brand font-semibold hover:text-brand-hover"
                >
                  すべて見る
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {subs.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/categories/${m.slug}/${s.slug}`}
                    className="px-3 py-1.5 rounded-full bg-white border border-border text-sm hover:border-brand hover:text-brand"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
