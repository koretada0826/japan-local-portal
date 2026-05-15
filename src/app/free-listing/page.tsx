import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Sparkles, Building2, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FAQ } from "@/components/FAQ";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "店舗・企業の無料掲載募集｜全国対応の地域ポータル",
  description:
    "店舗・会社・施設の掲載は無料です。地域のお客様に見つけてもらうための第一歩を、無料で始めませんか？写真、紹介文、公式リンクなどを掲載できます。",
};

const merits = [
  "店舗名・住所・営業時間を無料で掲載",
  "公式サイトやSNSへのリンクを掲載",
  "写真や紹介文を自由に追加",
  "地域×業種ページに表示される",
  "掲載情報の修正がいつでも無料",
  "希望者には無料の集客診断レポート",
];

const flow = [
  {
    step: "1",
    title: "申請フォームを送信",
    text: "店舗情報・ご担当者情報をフォームに入力。所要時間は3〜5分です。",
  },
  {
    step: "2",
    title: "内容確認のご連絡",
    text: "必要に応じて担当者から確認のご連絡をすることがあります。",
  },
  {
    step: "3",
    title: "掲載完了",
    text: "内容を確認のうえ、まちセレクトに掲載いたします。修正もいつでも可能です。",
  },
];

const faqs = [
  {
    q: "本当に無料で掲載できますか？",
    a: "はい、店舗・会社・施設の基本掲載は無料です。希望されない限り、有料サービスを勝手に開始することはありません。",
  },
  {
    q: "掲載までどれくらいかかりますか？",
    a: "申請内容にもよりますが、目安として5営業日以内に掲載します。",
  },
  {
    q: "掲載できない業種はありますか？",
    a: "公序良俗に反する業種、法令で広告が制限されている業種は掲載をお断りする場合があります。",
  },
  {
    q: "個人情報はどう扱われますか？",
    a: "掲載準備および希望者への集客提案以外の用途では使用しません。詳細はプライバシーポリシーをご確認ください。",
  },
];

export default function FreeListingPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-soft via-white to-white">
        <div className="container-main pt-8 md:pt-14 pb-12 md:pb-16">
          <Breadcrumb
            items={[
              { href: "/", label: "ホーム" },
              { label: "無料掲載募集" },
            ]}
          />
          <div className="mt-4 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs font-semibold text-brand">
                事業者の方へ
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">
                店舗・企業の掲載は無料です
              </h1>
              <p className="mt-4 text-base text-muted leading-relaxed">
                地域のお客様に見つけてもらうための第一歩を、無料で始めませんか？
                写真・紹介文・公式リンクを無料で掲載できます。
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/free-listing/apply"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover"
                >
                  無料で掲載申請する
                </Link>
                <Link
                  href="#flow"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border bg-white font-semibold hover:border-brand"
                >
                  掲載までの流れを見る
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-border">
                  <ShieldCheck size={12} className="text-brand" />
                  申請3〜5分
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-border">
                  <ShieldCheck size={12} className="text-brand" />
                  個人情報は厳重管理
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-brand">
                <Sparkles size={18} />
                <span className="font-bold">掲載メリット</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {merits.map((m) => (
                  <li key={m} className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-brand mt-0.5 shrink-0"
                    />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="flow" className="container-main py-12 md:py-16">
        <SectionHeader title="掲載までの流れ" />
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {flow.map((f) => (
            <div
              key={f.step}
              className="bg-white rounded-2xl border border-border p-5 md:p-6"
            >
              <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-bold">
                {f.step}
              </div>
              <div className="mt-3 font-bold">{f.title}</div>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-soft py-12 md:py-16">
        <div className="container-main">
          <SectionHeader title="対応している業種" />
          <p className="text-sm text-muted">
            飲食、美容、医療、フィットネス、暮らし、教育、士業、介護、住宅、車、法人向けサービス、娯楽など、あらゆる業種に対応しています。
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "飲食店",
              "美容・サロン",
              "医療・健康",
              "フィットネス",
              "暮らし",
              "教育",
              "士業・専門家",
              "介護・福祉",
              "住宅・建築",
              "車・バイク",
              "法人向けサービス",
              "娯楽・レジャー",
            ].map((c) => (
              <div
                key={c}
                className="bg-white rounded-xl border border-border p-3 text-sm flex items-center gap-2"
              >
                <Building2 size={14} className="text-brand" />
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-main py-12 md:py-16">
        <SectionHeader title="よくある質問" />
        <FAQ items={faqs} />
      </section>

      <section className="container-main pb-16">
        <div className="bg-gradient-to-br from-brand to-brand-hover rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            まずは無料で掲載申請
          </h2>
          <p className="mt-3 text-white/90 text-sm md:text-base">
            申請後の有料サービスは強制されません。ご希望の方にのみご案内します。
          </p>
          <Link
            href="/free-listing/apply"
            className="mt-6 inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white text-brand font-bold hover:bg-white/90"
          >
            無料掲載申請フォームへ
          </Link>
        </div>
      </section>

      <section className="container-main pb-16">
        <div className="bg-white rounded-2xl border border-border p-5 text-xs text-muted">
          <strong className="text-foreground">個人情報の取り扱い</strong>
          <p className="mt-2 leading-relaxed">
            ご入力いただいた情報は、掲載準備および掲載内容確認のためにのみ使用します。「希望者に限り、集客改善のご提案を送る」ことに同意いただいた方には、関連サービスのご案内を差し上げる場合があります。詳細は
            <Link href="/privacy" className="text-brand">
              プライバシーポリシー
            </Link>
            をご確認ください。
          </p>
        </div>
      </section>
    </>
  );
}
