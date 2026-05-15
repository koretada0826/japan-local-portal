import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "おすすめ記事",
  description:
    "地域×業種でまとめたおすすめ記事一覧。地域のお店・会社・施設を選ぶ際の参考にお使いください。",
};

export default function ArticlesPage() {
  return (
    <div className="container-main py-8 md:py-12">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { label: "おすすめ記事" },
        ]}
      />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">おすすめ記事</h1>
      <p className="mt-2 text-sm text-muted">
        地域×業種でまとめた特集記事を掲載しています。
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
              <h2 className="font-bold text-foreground line-clamp-2">
                {a.title}
              </h2>
              <p className="mt-2 text-sm text-muted line-clamp-2">
                {a.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
