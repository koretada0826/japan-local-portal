import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function OwnerCTA({ businessId }: { businessId?: string }) {
  const href = businessId
    ? `/claim-business/${businessId}`
    : "/free-listing/apply";

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-soft to-white p-5 md:p-7">
      <div className="font-bold text-foreground text-lg">
        この店舗・企業のオーナー様へ
      </div>
      <p className="text-sm text-muted mt-2 leading-relaxed">
        掲載情報の追加・修正は<strong className="text-foreground">無料</strong>です。
        写真、紹介文、公式サイト、SNSリンクなどを追加できます。掲載内容に誤りがある場合も、こちらから修正申請が可能です。
      </p>
      <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-foreground">
        {[
          "掲載は無料",
          "公式リンク・写真を追加できる",
          "オーナー認証で内容を管理",
          "ご希望の方には無料の集客診断",
        ].map((t) => (
          <li key={t} className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-brand mt-0.5" />
            {t}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-5 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-hover"
      >
        掲載内容を確認・修正する
      </Link>
    </div>
  );
}

export function FreeListingBanner() {
  return (
    <section className="bg-gradient-to-br from-brand-soft via-white to-brand-soft border border-border rounded-2xl p-6 md:p-10">
      <div className="md:flex md:items-center md:justify-between gap-6">
        <div>
          <div className="text-xs font-semibold text-brand">
            事業者の方へ
          </div>
          <h2 className="mt-1 text-xl md:text-2xl font-bold text-foreground">
            店舗・企業の掲載は無料です
          </h2>
          <p className="mt-2 text-sm text-muted max-w-2xl">
            あなたのお店・会社・施設を、地域のお客様に見つけてもらう第一歩を、無料で始めませんか？
            写真、紹介文、公式リンク、営業時間などを掲載できます。
          </p>
        </div>
        <div className="mt-5 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Link
            href="/free-listing/apply"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-hover whitespace-nowrap"
          >
            無料で掲載申請する
          </Link>
          <Link
            href="/free-listing"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-border bg-white text-foreground text-sm font-semibold hover:border-brand whitespace-nowrap"
          >
            掲載のメリットを見る
          </Link>
        </div>
      </div>
    </section>
  );
}
