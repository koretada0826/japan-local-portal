import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "掲載情報の確認・修正依頼を受け付けました",
  robots: { index: false, follow: false },
};

export default function ClaimThanksPage() {
  return (
    <div className="container-main py-16 md:py-24 max-w-2xl text-center">
      <div className="w-16 h-16 rounded-full bg-brand-soft text-brand flex items-center justify-center mx-auto">
        <CheckCircle2 size={32} />
      </div>
      <h1 className="mt-6 text-2xl md:text-3xl font-bold">
        掲載情報の確認・修正依頼を受け付けました
      </h1>
      <p className="mt-4 text-sm text-muted leading-relaxed">
        内容を確認のうえ、順次反映いたします。
        <br />
        必要に応じて担当者よりご連絡する場合があります。
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover"
        >
          トップに戻る
        </Link>
      </div>
    </div>
  );
}
