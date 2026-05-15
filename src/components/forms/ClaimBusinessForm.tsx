"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  claimBusinessSchema,
  type ClaimBusinessInput,
} from "@/lib/leadSchemas";
import { cn } from "@/lib/utils";

const interestedOptions = [
  { value: "hp", label: "HP制作" },
  { value: "meo", label: "MEO対策" },
  { value: "sns", label: "SNS運用" },
  { value: "recruiting", label: "採用支援" },
] as const;

export function ClaimBusinessForm({
  businessId,
  businessName,
}: {
  businessId: string;
  businessName: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimBusinessInput>({
    resolver: zodResolver(claimBusinessSchema),
    defaultValues: {
      businessId,
      businessName,
      interestedServices: [],
    },
  });

  const onSubmit = async (data: ClaimBusinessInput) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind: "claim_business" }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "送信に失敗しました");
      }
      router.push("/claim-business/thanks");
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "送信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <input type="hidden" {...register("businessId")} />
      <input type="hidden" {...register("businessName")} />

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

      <Section title="店舗情報の確認">
        <Field
          label={`現在の掲載情報「${businessName}」は正しいですか？`}
          required
          error={errors.isCurrentInfoCorrect?.message}
        >
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-white text-sm cursor-pointer hover:border-brand">
              <input type="radio" value="yes" {...register("isCurrentInfoCorrect")} />
              正しい
            </label>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-white text-sm cursor-pointer hover:border-brand">
              <input type="radio" value="no" {...register("isCurrentInfoCorrect")} />
              修正したい点がある
            </label>
          </div>
        </Field>
        <Field label="修正したい内容（誤り・追加情報など）">
          <textarea
            {...register("correctionContent")}
            rows={4}
            className="input"
            placeholder="例：定休日が変更になりました…"
          />
        </Field>
      </Section>

      <Section title="追加したい情報">
        <Field label="追加したい写真URL">
          <input
            {...register("newImageUrl")}
            className="input"
            placeholder="https://example.com/photo.jpg"
          />
        </Field>
        <Field label="追加したい紹介文">
          <textarea
            {...register("newDescription")}
            rows={4}
            className="input"
            placeholder="お店の魅力や強みを記載してください"
          />
        </Field>
        <Field label="公式サイトURL">
          <input
            {...register("websiteUrl")}
            className="input"
            placeholder="https://example.com"
            type="url"
          />
        </Field>
        <Field label="SNS URL">
          <input
            {...register("snsUrl")}
            className="input"
            placeholder="https://instagram.com/..."
          />
        </Field>
      </Section>

      <Section title="ご担当者情報">
        <Field
          label="ご担当者名"
          required
          error={errors.contactName?.message}
        >
          <input {...register("contactName")} className="input" />
        </Field>
        <Field label="役職">
          <input {...register("contactRole")} className="input" />
        </Field>
        <Field label="決裁者名">
          <input {...register("decisionMakerName")} className="input" />
        </Field>
        <Field label="決裁者役職">
          <input {...register("decisionMakerRole")} className="input" />
        </Field>
        <Field
          label="メールアドレス"
          required
          error={errors.email?.message}
        >
          <input {...register("email")} type="email" className="input" />
        </Field>
        <Field
          label="ご連絡先電話番号"
          required
          error={errors.phone?.message}
        >
          <input {...register("phone")} className="input" />
        </Field>
      </Section>

      <Section title="ご興味のあるサービス（任意）">
        <Field label="興味のあるサービス（複数選択可）">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {interestedOptions.map((o) => (
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
              <strong>無料の集客診断レポートを希望する</strong>
              <span className="block text-xs text-muted mt-0.5">
                掲載修正後に、御社向けの簡易診断レポートを差し上げます（任意）。
              </span>
            </span>
          </label>
        </Field>
      </Section>

      <Section title="同意事項">
        <div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              {...register("agreePrivacy")}
              className="mt-1"
            />
            <span>
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                プライバシーポリシー
              </a>
              に同意し、入力した情報の取り扱いに同意します。
              <span className="text-accent ml-1">必須</span>
            </span>
          </label>
          {errors.agreePrivacy?.message && (
            <p className="mt-1 text-xs text-accent ml-6">
              {errors.agreePrivacy.message}
            </p>
          )}
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
          "w-full md:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-brand text-white font-bold hover:bg-brand-hover disabled:opacity-60",
          submitting && "opacity-60"
        )}
      >
        {submitting ? "送信中..." : "掲載情報の確認・修正を申請する"}
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
          min-height: 100px;
          line-height: 1.7;
        }
      `}</style>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-border p-5 md:p-7">
      <h2 className="text-lg md:text-xl font-bold">{title}</h2>
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
