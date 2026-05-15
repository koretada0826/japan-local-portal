import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "掲載申請を受け付けました",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <div className="container-main py-16 md:py-24 max-w-2xl text-center">
      <div className="w-16 h-16 rounded-full bg-brand-soft text-brand flex items-center justify-center mx-auto">
        <CheckCircle2 size={32} />
      </div>
      <h1 className="mt-6 text-2xl md:text-3xl font-bold">
        掲載申請を受け付けました
      </h1>
      <p className="mt-4 text-sm text-muted leading-relaxed">
        内容を確認のうえ、掲載準備を進めます。
        <br />
        必要に応じて担当者より確認のご連絡をする場合があります。
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover"
        >
          トップに戻る
        </Link>
        <Link
          href="/free-listing"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border bg-white font-semibold hover:border-brand"
        >
          掲載案内をもう一度見る
        </Link>
      </div>
    </div>
  );
}
