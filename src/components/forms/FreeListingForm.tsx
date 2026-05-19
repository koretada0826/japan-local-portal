"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  freeListingSchema,
  type FreeListingInput,
} from "@/lib/leadSchemas";
import {
  getMainCategories,
  getSubCategories,
} from "@/data/categories";
import { cn } from "@/lib/utils";
import { CategorizedImageUpload } from "@/components/CategorizedImageUpload";

const interestedServiceOptions = [
  { value: "hp", label: "HP制作" },
  { value: "lp", label: "LP制作" },
  { value: "meo", label: "MEO対策" },
  { value: "sns", label: "SNS運用" },
  { value: "recruiting", label: "採用支援" },
] as const;

export function FreeListingForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FreeListingInput>({
    resolver: zodResolver(freeListingSchema),
    defaultValues: {
      interestedServices: [],
      imageUrls: [],
    },
  });

  const onSubmit = async (data: FreeListingInput) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind: "free_listing" }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "送信に失敗しました");
      }
      router.push("/free-listing/thanks");
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "送信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* honeypot — 人間には見えない。bot対策。 */}
      <div aria-hidden="true" className="absolute -left-[9999px] opacity-0 pointer-events-none">
        <label>
          Do not fill this field
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("honeypot_url")}
          />
        </label>
      </div>

      <Section
        no="1"
        title="店舗・企業情報"
        description="基本となる店舗・会社の情報をご入力ください。"
      >
        <Field
          label="店舗名 / 企業名"
          required
          error={errors.companyName?.message}
        >
          <input
            {...register("companyName")}
            placeholder="例：cafe mellow 池袋"
            className="input"
          />
        </Field>
        <Field
          label="業種カテゴリ"
          required
          error={errors.categorySlug?.message}
        >
          <select {...register("categorySlug")} className="input">
            <option value="">業種を選択</option>
            {getMainCategories().map((m) => (
              <optgroup key={m.slug} label={m.name}>
                {getSubCategories(m.slug).map((s) => (
                  <option key={s.slug} value={`${m.slug}/${s.slug}`}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label="所在地" required error={errors.address?.message}>
          <input
            {...register("address")}
            placeholder="例：東京都豊島区西池袋1-x-x"
            className="input"
          />
        </Field>
        <Field label="電話番号">
          <input
            {...register("phone")}
            placeholder="例：03-xxxx-xxxx"
            className="input"
          />
        </Field>
        <Field label="公式サイトURL" error={errors.websiteUrl?.message}>
          <input
            {...register("websiteUrl")}
            placeholder="https://example.com"
            className="input"
            type="url"
          />
        </Field>
        <Field label="Instagram URL">
          <input
            {...register("instagramUrl")}
            placeholder="https://instagram.com/..."
            className="input"
          />
        </Field>
        <Field label="GoogleマップURL">
          <input
            {...register("googleMapUrl")}
            placeholder="https://maps.google.com/..."
            className="input"
          />
        </Field>
      </Section>

      <Section
        no="2"
        title="掲載したい内容"
        description="掲載ページに表示したい内容をご入力ください。"
      >
        <Field label="紹介文" error={errors.description?.message}>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="例：池袋駅徒歩3分、本棚と観葉植物に囲まれた…"
            className="input"
          />
        </Field>
        <Field label="お店の写真（メイン1枚 / 外観・内装・メニュー 各最大2枚）">
          <CategorizedImageUpload
            name="imageUrls"
            sessionIdName="uploadSessionId"
            onChange={(urls) => {
              setValue("imageUrls", urls, { shouldValidate: true });
              setValue("imageUrl", urls[0] ?? "", { shouldValidate: true });
            }}
          />
        </Field>
        <Field label="営業時間">
          <input
            {...register("businessHours")}
            placeholder="例：10:00 - 22:00"
            className="input"
          />
        </Field>
        <Field label="定休日">
          <input
            {...register("regularHoliday")}
            placeholder="例：水曜日 / 不定休"
            className="input"
          />
        </Field>
        <Field label="料金目安">
          <input
            {...register("priceRange")}
            placeholder="例：¥800〜¥1,800"
            className="input"
          />
        </Field>
        <Field label="特徴タグ（カンマ区切り）">
          <input
            {...register("features")}
            placeholder="例：駅近, Wi-Fi, 電源あり, 作業向き"
            className="input"
          />
        </Field>
      </Section>

      <Section
        no="3"
        title="ご担当者情報"
        description="掲載準備および確認のため、ご担当者様の情報を伺います。"
      >
        <Field
          label="ご担当者名"
          required
          error={errors.contactName?.message}
        >
          <input
            {...register("contactName")}
            placeholder="例：山田 太郎"
            className="input"
          />
        </Field>
        <Field label="役職" error={errors.contactRole?.message}>
          <input
            {...register("contactRole")}
            placeholder="例：店長 / マーケティング担当"
            className="input"
          />
        </Field>
        <Field
          label="メールアドレス"
          required
          error={errors.email?.message}
        >
          <input
            {...register("email")}
            placeholder="example@example.com"
            type="email"
            className="input"
          />
        </Field>
        <Field
          label="ご連絡先電話番号"
          required
          error={errors.contactPhone?.message}
        >
          <input
            {...register("contactPhone")}
            placeholder="例：090-xxxx-xxxx"
            className="input"
          />
        </Field>
      </Section>

      <Section
        no="4"
        title="決裁者情報"
        description="集客や採用などの意思決定にあたる方の情報を任意でご記入ください。"
      >
        <Field label="決裁者名" error={errors.decisionMakerName?.message}>
          <input
            {...register("decisionMakerName")}
            placeholder="例：山田 太郎"
            className="input"
          />
        </Field>
        <Field label="決裁者役職">
          <input
            {...register("decisionMakerRole")}
            placeholder="例：代表取締役 / オーナー"
            className="input"
          />
        </Field>
        <Field label="決裁者と担当者は同じですか？">
          <Radios
            name="decisionMakerSame"
            register={register}
            options={[
              { value: "same", label: "同じ" },
              { value: "different", label: "別の方" },
            ]}
          />
        </Field>
        <Field label="決裁者への直接連絡は可能ですか？">
          <Radios
            name="decisionMakerContactable"
            register={register}
            options={[
              { value: "yes", label: "可" },
              { value: "no", label: "不可" },
            ]}
          />
        </Field>
      </Section>

      <Section
        no="5"
        title="集客・採用課題"
        description="現在のWeb活用状況をお聞かせください（任意）。"
      >
        <Field label="ホームページはありますか？">
          <Radios
            name="hasWebsite"
            register={register}
            options={[
              { value: "yes", label: "ある" },
              { value: "no", label: "ない" },
              { value: "unknown", label: "わからない" },
            ]}
          />
        </Field>
        <Field label="Googleビジネスプロフィールを管理していますか？">
          <Radios
            name="hasGoogleBusinessProfile"
            register={register}
            options={[
              { value: "yes", label: "管理している" },
              { value: "no", label: "管理していない" },
              { value: "unknown", label: "わからない" },
            ]}
          />
        </Field>
        <Field label="SNSを運用していますか？">
          <Radios
            name="usesSns"
            register={register}
            options={[
              { value: "yes", label: "運用中" },
              { value: "no", label: "運用していない" },
              { value: "unknown", label: "わからない" },
            ]}
          />
        </Field>
        <Field label="採用にお困りですか？">
          <Radios
            name="hasRecruitingIssue"
            register={register}
            options={[
              { value: "yes", label: "課題あり" },
              { value: "no", label: "特になし" },
              { value: "unknown", label: "わからない" },
            ]}
          />
        </Field>
        <Field label="興味のあるサービス（複数選択可）">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {interestedServiceOptions.map((o) => (
              <label
                key={o.value}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-white text-sm cursor-pointer hover:border-brand"
              >
                <input
                  type="checkbox"
                  value={o.value}
                  {...register("interestedServices")}
                />
                {o.label}
              </label>
            ))}
          </div>
        </Field>
        <Field label="">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              {...register("wantsDiagnosis")}
              className="mt-1"
            />
            <span>
              <strong>無料の集客診断レポートを受け取る</strong>
              <span className="block text-xs text-muted mt-0.5">
                掲載完了後に、御社のお店・会社向けの簡易診断レポートを差し上げます（任意）。
              </span>
            </span>
          </label>
        </Field>
      </Section>

      <Section
        no="6"
        title="同意事項"
        description="ご一読のうえ、同意のチェックをお願いいたします。"
      >
        <div className="space-y-3 text-sm">
          <Consent
            register={register("agreePrivacy")}
            error={errors.agreePrivacy?.message}
          >
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline"
            >
              プライバシーポリシー
            </a>
            に同意し、入力した情報の取り扱いに同意します。<span className="text-accent">必須</span>
          </Consent>
          <Consent
            register={register("agreeContact")}
            error={errors.agreeContact?.message}
          >
            掲載内容の確認のため、運営から連絡することに同意します。
            <span className="text-accent">必須</span>
          </Consent>
          <Consent register={register("agreeProposal")}>
            希望者に限り、集客改善のご提案を送ることに同意します。（任意）
          </Consent>
        </div>
      </Section>

      {serverError && (
        <p className="text-sm text-accent bg-red-50 border border-red-200 rounded-xl p-3">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={cn(
          "w-full md:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-brand text-white font-bold hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed",
          submitting && "opacity-60"
        )}
      >
        {submitting ? "送信中..." : "無料掲載を申請する"}
      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: white;
          font-size: 14px;
          outline: none;
          color: var(--foreground);
        }
        .input:focus {
          border-color: var(--brand);
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.15);
        }
        textarea.input {
          resize: vertical;
          min-height: 120px;
          line-height: 1.7;
        }
      `}</style>
    </form>
  );
}

function Section({
  no,
  title,
  description,
  children,
}: {
  no: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-border p-5 md:p-7">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">
          {no}
        </div>
        <h2 className="text-lg md:text-xl font-bold">{title}</h2>
      </div>
      {description && (
        <p className="mt-2 text-sm text-muted">{description}</p>
      )}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="md:col-span-2">
      {label && (
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          {label}
          {required && (
            <span className="ml-1 text-accent text-xs">必須</span>
          )}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}

function Radios({
  name,
  register,
  options,
}: {
  name: keyof FreeListingInput;
  register: ReturnType<typeof useForm<FreeListingInput>>["register"];
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label
          key={o.value}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-white text-sm cursor-pointer hover:border-brand"
        >
          <input type="radio" value={o.value} {...register(name)} />
          {o.label}
        </label>
      ))}
    </div>
  );
}

function Consent({
  register,
  error,
  children,
}: {
  register: ReturnType<ReturnType<typeof useForm<FreeListingInput>>["register"]>;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-start gap-2">
        <input type="checkbox" {...register} className="mt-1" />
        <span>{children}</span>
      </label>
      {error && <p className="mt-1 text-xs text-accent ml-6">{error}</p>}
    </div>
  );
}
