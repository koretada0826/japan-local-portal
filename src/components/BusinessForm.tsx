"use client";

import { useState, useMemo } from "react";
import type { Business, Category, Region } from "@/types";

type Props = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  mainCategories: Category[];
  subCategories: Category[];
  prefectures: Region[];
  initial?: Business;
};

/**
 * 店舗の追加・編集を共通化したフォーム
 * - 大カテゴリ変更で中カテゴリのオプションが連動
 * - 多くのフィールドが任意
 */
export function BusinessForm({
  action,
  submitLabel,
  mainCategories,
  subCategories,
  prefectures,
  initial,
}: Props) {
  const [main, setMain] = useState(initial?.mainCategorySlug ?? "");
  const [sub, setSub] = useState(initial?.subCategorySlug ?? "");

  const subOptions = useMemo(
    () => subCategories.filter((c) => c.parentSlug === main),
    [main, subCategories]
  );

  return (
    <form action={action} className="space-y-8">
      {/* 基本情報 */}
      <Section title="基本情報" required>
        <Field label="店舗名" required>
          <input
            name="name"
            required
            defaultValue={initial?.name}
            className="form-input"
            placeholder="例：cafe mellow 池袋"
          />
        </Field>
        <Field label="スラッグ（URLの一部・英数字とハイフン / 空欄なら自動生成）">
          <input
            name="slug"
            defaultValue={initial?.slug}
            pattern="[a-z0-9-]+"
            placeholder="例：cafe-mellow-ikebukuro"
            className="form-input"
          />
        </Field>
        <Field label="短い紹介（50字程度・カードに表示）" required>
          <input
            name="shortDescription"
            required
            maxLength={120}
            defaultValue={initial?.shortDescription}
            placeholder="例：池袋駅徒歩3分の作業もデートも叶うブックカフェ"
            className="form-input"
          />
        </Field>
        <Field label="詳しい紹介（400字程度・店舗ページに表示）" required>
          <textarea
            name="description"
            required
            rows={5}
            defaultValue={initial?.description}
            placeholder="お店の魅力や雰囲気、こだわりを記載"
            className="form-input"
          />
        </Field>
        <Field label="メイン画像URL（http(s)://で始まるURL / 空欄ならランダム画像）">
          <input
            type="url"
            name="mainImageUrl"
            defaultValue={initial?.mainImageUrl}
            placeholder="https://example.com/image.jpg"
            className="form-input"
          />
        </Field>
      </Section>

      {/* 地域 */}
      <Section title="地域">
        <Field label="都道府県" required>
          <select
            name="prefectureSlug"
            required
            defaultValue={initial?.prefectureSlug ?? ""}
            className="form-input"
          >
            <option value="">選択してください</option>
            {prefectures.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="市区町村スラッグ（既存があれば slug を、無ければ任意の英数字）">
          <input
            name="citySlug"
            defaultValue={initial?.citySlug}
            placeholder="例：toshima"
            className="form-input"
          />
        </Field>
        <Field label="エリアスラッグ（駅・地区名等）">
          <input
            name="areaSlug"
            defaultValue={initial?.areaSlug}
            placeholder="例：ikebukuro"
            className="form-input"
          />
        </Field>
        <Field label="住所" required>
          <input
            name="address"
            required
            defaultValue={initial?.address}
            placeholder="例：東京都豊島区西池袋1-x-x"
            className="form-input"
          />
        </Field>
      </Section>

      {/* カテゴリ */}
      <Section title="業種カテゴリ">
        <Field label="大カテゴリ" required>
          <select
            name="mainCategorySlug"
            required
            value={main}
            onChange={(e) => {
              setMain(e.target.value);
              setSub("");
            }}
            className="form-input"
          >
            <option value="">選択してください</option>
            {mainCategories.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="中カテゴリ" required>
          <select
            name="subCategorySlug"
            required
            value={sub}
            onChange={(e) => setSub(e.target.value)}
            disabled={!main}
            className="form-input"
          >
            <option value="">{main ? "選択してください" : "先に大カテゴリを選んでください"}</option>
            {subOptions.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      {/* 営業情報 */}
      <Section title="営業情報・連絡先">
        <Field label="電話番号">
          <input
            name="phone"
            defaultValue={initial?.phone}
            placeholder="例：03-xxxx-xxxx"
            className="form-input"
          />
        </Field>
        <Field label="営業時間">
          <input
            name="businessHours"
            defaultValue={initial?.businessHours}
            placeholder="例：10:00 - 22:00"
            className="form-input"
          />
        </Field>
        <Field label="定休日">
          <input
            name="regularHoliday"
            defaultValue={initial?.regularHoliday}
            placeholder="例：不定休 / 水曜日"
            className="form-input"
          />
        </Field>
        <Field label="料金目安">
          <input
            name="priceRange"
            defaultValue={initial?.priceRange}
            placeholder="例：¥800〜¥1,800"
            className="form-input"
          />
        </Field>
        <Field label="公式サイトURL">
          <input
            type="url"
            name="websiteUrl"
            defaultValue={initial?.websiteUrl}
            placeholder="https://"
            className="form-input"
          />
        </Field>
        <Field label="Instagram URL">
          <input
            type="url"
            name="instagramUrl"
            defaultValue={initial?.instagramUrl}
            placeholder="https://instagram.com/..."
            className="form-input"
          />
        </Field>
        <Field label="Googleマップ URL">
          <input
            type="url"
            name="googleMapUrl"
            defaultValue={initial?.googleMapUrl}
            placeholder="https://maps.google.com/..."
            className="form-input"
          />
        </Field>
      </Section>

      {/* 特徴・推薦ポイント */}
      <Section title="特徴・おすすめポイント">
        <Field label="特徴タグ（カンマ区切り）">
          <input
            name="features"
            defaultValue={initial?.features?.join(", ")}
            placeholder="例：駅近, Wi-Fi, 個室"
            className="form-input"
          />
        </Field>
        <Field label="おすすめポイント（カンマ区切り）">
          <input
            name="recommendPoints"
            defaultValue={initial?.recommendPoints?.join(", ")}
            placeholder="例：自家焙煎コーヒー, スイーツ自家製"
            className="form-input"
          />
        </Field>
        <Field label="提供サービス・メニュー（カンマ区切り）">
          <input
            name="services"
            defaultValue={initial?.services?.join(", ")}
            placeholder="例：コーヒー, ランチ, バー"
            className="form-input"
          />
        </Field>
      </Section>

      {/* 表示設定 */}
      <Section title="表示設定">
        <Field label="表示順（小さい数字ほど上位）">
          <input
            type="number"
            name="displayOrder"
            defaultValue={initial?.displayOrder ?? 100}
            min={0}
            max={9999}
            className="form-input"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3 md:col-span-2">
          <Checkbox
            name="isFeatured"
            label="おすすめに表示"
            defaultChecked={initial?.isFeatured}
          />
          <Checkbox
            name="isPaid"
            label="有料プラン店舗"
            defaultChecked={initial?.isPaid}
          />
          <Checkbox
            name="isPremium"
            label="プレミアム掲載（PR表示）"
            defaultChecked={initial?.isPremium}
          />
          <Checkbox
            name="isClaimed"
            label="認証済み店舗"
            defaultChecked={initial?.isClaimed}
          />
        </div>
      </Section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  required,
  children,
}: {
  title: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-border p-5 md:p-6">
      <h2 className="font-bold mb-4">
        {title}
        {required && <span className="text-red-500 ml-1">*</span>}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block md:col-span-2">
      <span className="block text-xs font-semibold text-muted mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="w-4 h-4"
      />
      {label}
    </label>
  );
}
