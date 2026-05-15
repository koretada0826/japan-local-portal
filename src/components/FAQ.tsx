export type FAQItem = { q: string; a: string };

export function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-border divide-y divide-border">
      {items.map((item, i) => (
        <details key={i} className="group p-5 md:p-6">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <span className="font-semibold text-foreground">
              Q. {item.q}
            </span>
            <span className="text-muted text-xl leading-none group-open:rotate-45 transition-transform">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            A. {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
      },
    })),
  };
}
