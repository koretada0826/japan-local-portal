import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BusinessCard } from "@/components/BusinessCard";
import { SectionHeader } from "@/components/SectionHeader";
import { FreeListingBanner } from "@/components/OwnerCTA";
import { findArticle, articles } from "@/data/articles";
import { findBusiness } from "@/data/businesses";
import { SITE_CONFIG } from "@/lib/config";

type Params = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const { slug } = await props.params;
  const a = findArticle(slug);
  if (!a) return {};
  return {
    title: a.seoTitle,
    description: a.seoDescription,
    alternates: { canonical: `${SITE_CONFIG.url}/articles/${a.slug}` },
    openGraph: {
      title: a.title,
      description: a.excerpt,
      images: [a.mainImageUrl],
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage(props: { params: Params }) {
  const { slug } = await props.params;
  const article = findArticle(slug);
  if (!article) notFound();

  const relatedBusinesses = article.relatedBusinessSlugs
    .map(findBusiness)
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [article.mainImageUrl],
    datePublished: article.publishedAt,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
    },
  };

  return (
    <article className="container-main py-8 md:py-12 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/articles", label: "おすすめ記事" },
          { label: article.title.slice(0, 30) + "..." },
        ]}
      />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold leading-tight">
        {article.title}
      </h1>
      <p className="mt-3 text-sm text-muted">{article.excerpt}</p>

      <div
        className="mt-6 aspect-[16/9] rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${article.mainImageUrl})` }}
      />

      {article.content ? (
        <div
          className="mt-8 text-foreground
            [&>p]:my-4 [&>p]:text-sm md:[&>p]:text-base [&>p]:leading-relaxed
            [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:border-l-4 [&_h2]:border-brand [&_h2]:pl-3
            [&_h3]:mt-7 [&_h3]:mb-3 [&_h3]:text-base md:[&_h3]:text-lg [&_h3]:font-bold
            [&_h3>a]:text-foreground [&_h3>a]:hover:text-brand
            [&_a]:text-brand [&_a]:font-medium [&_a]:hover:underline
            [&_.biz-link]:inline-flex [&_.biz-link]:items-center [&_.biz-link]:gap-1 [&_.biz-link]:mt-1 [&_.biz-link]:px-3 [&_.biz-link]:py-2 [&_.biz-link]:rounded-xl [&_.biz-link]:border [&_.biz-link]:border-border [&_.biz-link]:bg-white [&_.biz-link]:text-sm [&_.biz-link]:hover:border-brand [&_.biz-link]:hover:no-underline"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      ) : (
        <div className="mt-8 text-foreground">
          <p className="text-sm md:text-base leading-relaxed">
            この記事では、{article.title.replace(/[｜|].*$/, "")}を選ぶ際のポイントと、おすすめのお店・会社・施設をご紹介します。
          </p>
        </div>
      )}

      {relatedBusinesses.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="記事で紹介する店舗・企業" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedBusinesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <SectionHeader title="関連記事" />
        <div className="space-y-2">
          {articles
            .filter((a) => a.slug !== article.slug)
            .map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.slug}`}
                className="block bg-white rounded-xl border border-border p-4 hover:border-brand"
              >
                <div className="font-semibold">{a.title}</div>
                <div className="text-xs text-muted mt-1 line-clamp-1">
                  {a.excerpt}
                </div>
              </Link>
            ))}
        </div>
      </section>

      <section className="mt-12">
        <FreeListingBanner />
      </section>
    </article>
  );
}
