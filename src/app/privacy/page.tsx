import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="container-main py-8 md:py-12 max-w-3xl">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { label: "プライバシーポリシー" },
        ]}
      />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">プライバシーポリシー</h1>
      <div className="mt-6 space-y-6 text-sm text-foreground leading-relaxed">
        <section>
          <h2 className="font-bold text-base">1. 取得する個人情報</h2>
          <p className="mt-2 text-muted">
            掲載申請・掲載情報の確認・お問い合わせ等のフォーム送信時に、お名前、役職、メールアドレス、電話番号、所属企業・店舗情報、集客に関するご要望などの情報を取得することがあります。
          </p>
        </section>
        <section>
          <h2 className="font-bold text-base">2. 利用目的</h2>
          <p className="mt-2 text-muted">
            取得した個人情報は、以下の目的でのみ利用します。
          </p>
          <ul className="mt-2 list-disc list-inside text-muted">
            <li>掲載準備および掲載内容確認の連絡</li>
            <li>掲載情報の修正・更新のための連絡</li>
            <li>ご同意いただいた方への、集客改善に関するご提案</li>
            <li>お問い合わせへの返信</li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-base">3. 第三者提供</h2>
          <p className="mt-2 text-muted">
            法令に基づく場合を除き、本人の同意なく第三者に個人情報を提供することはありません。
          </p>
        </section>
        <section>
          <h2 className="font-bold text-base">4. 開示・訂正・削除のご請求</h2>
          <p className="mt-2 text-muted">
            ご自身の個人情報の開示・訂正・削除等のご請求は、お問い合わせフォームよりご連絡ください。
          </p>
        </section>
        <section>
          <h2 className="font-bold text-base">5. お問い合わせ窓口</h2>
          <p className="mt-2 text-muted">
            運営：{SITE_CONFIG.name}
            <br />
            連絡先：{SITE_CONFIG.email}
          </p>
        </section>
        <p className="text-xs text-muted-soft">
          制定日：{new Date().toLocaleDateString("ja-JP")}
        </p>
      </div>
    </div>
  );
}
