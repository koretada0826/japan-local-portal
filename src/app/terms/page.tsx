import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "利用規約",
};

export default function TermsPage() {
  return (
    <div className="container-main py-8 md:py-12 max-w-3xl">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { label: "利用規約" },
        ]}
      />
      <h1 className="mt-4 text-2xl md:text-3xl font-bold">利用規約</h1>
      <div className="mt-6 space-y-6 text-sm text-foreground leading-relaxed">
        <section>
          <h2 className="font-bold text-base">第1条（適用）</h2>
          <p className="mt-2 text-muted">
            本規約は、{SITE_CONFIG.name}（以下「当サイト」）の利用に関する一切に適用されます。
          </p>
        </section>
        <section>
          <h2 className="font-bold text-base">第2条（掲載情報）</h2>
          <p className="mt-2 text-muted">
            当サイトの掲載情報は、公開情報および事業者から提供された情報に基づきますが、その正確性・最新性を保証するものではありません。最新情報については各事業者の公式情報をご確認ください。
          </p>
        </section>
        <section>
          <h2 className="font-bold text-base">第3条（無料掲載）</h2>
          <p className="mt-2 text-muted">
            事業者の掲載は無料です。希望されない限り、有料サービスを勝手に開始することはありません。
          </p>
        </section>
        <section>
          <h2 className="font-bold text-base">第4条（禁止事項）</h2>
          <p className="mt-2 text-muted">
            利用者は、法令違反、公序良俗に反する行為、虚偽情報の登録、第三者の権利を侵害する行為等を行ってはなりません。
          </p>
        </section>
        <section>
          <h2 className="font-bold text-base">第5条（免責事項）</h2>
          <p className="mt-2 text-muted">
            当サイトに掲載された情報の利用に起因して生じた損害について、当サイトは責任を負いません。
          </p>
        </section>
      </div>
    </div>
  );
}
