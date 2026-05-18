"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { Category, Region } from "@/types";

type Props = {
  prefectures: { regionName: string; regionSlug: string; items: Region[] }[];
  mainCategories: Category[];
  subCategories: Category[];
  initialQ?: string;
  initialPref?: string;
  initialMain?: string;
  initialSub?: string;
  hasAnyFilter?: boolean;
};

/**
 * /search ページの検索フィルタフォーム
 * - 大カテゴリ変更時に中カテゴリのオプションを動的更新（連動）
 * - URL から初期値を受け取れる
 */
export function SearchFiltersForm({
  prefectures,
  mainCategories,
  subCategories,
  initialQ = "",
  initialPref = "",
  initialMain = "",
  initialSub = "",
  hasAnyFilter = false,
}: Props) {
  const [main, setMain] = useState(initialMain);
  const [sub, setSub] = useState(initialSub);

  const subOptions = useMemo(() => {
    if (!main) return [];
    return subCategories.filter((c) => c.parentSlug === main);
  }, [main, subCategories]);

  return (
    <form
      action="/search"
      method="get"
      className="mt-6 bg-white border border-border rounded-2xl p-4 md:p-5 shadow-sm"
    >
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-12">
        {/* キーワード */}
        <div className="sm:col-span-2 md:col-span-5">
          <label className="block text-xs font-semibold text-muted mb-1">
            キーワード
          </label>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft"
            />
            <input
              type="text"
              name="q"
              defaultValue={initialQ}
              placeholder="例：池袋 カフェ / 渋谷 美容室"
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-border text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
        </div>

        {/* 都道府県 */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-muted mb-1">
            都道府県
          </label>
          <select
            name="pref"
            defaultValue={initialPref}
            className="w-full px-3 py-3 rounded-xl border border-border bg-white text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          >
            <option value="">全国</option>
            {prefectures.map((g) =>
              g.items.length === 0 ? null : (
                <optgroup key={g.regionSlug} label={g.regionName}>
                  {g.items.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
              )
            )}
          </select>
        </div>

        {/* 大カテゴリ */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">
            大カテゴリ
          </label>
          <select
            name="main"
            value={main}
            onChange={(e) => {
              setMain(e.target.value);
              setSub(""); // 大カテゴリ変更で中カテゴリリセット
            }}
            className="w-full px-3 py-3 rounded-xl border border-border bg-white text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          >
            <option value="">すべて</option>
            {mainCategories.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* 中カテゴリ（大カテゴリに連動） */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">
            中カテゴリ
          </label>
          <select
            name="sub"
            value={sub}
            onChange={(e) => setSub(e.target.value)}
            disabled={!main}
            className="w-full px-3 py-3 rounded-xl border border-border bg-white text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-surface-soft disabled:text-muted-soft disabled:cursor-not-allowed"
          >
            <option value="">すべて</option>
            {subOptions.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-muted-soft">
          {main
            ? "中カテゴリで業種をさらに絞り込めます"
            : "中カテゴリは大カテゴリを選ぶと有効になります"}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {hasAnyFilter && (
            <Link
              href="/search"
              className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-border bg-white text-sm hover:border-brand text-muted"
            >
              <X size={14} />
              条件クリア
            </Link>
          )}
          <button
            type="submit"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-hover"
          >
            <Search size={14} />
            この条件で検索
          </button>
        </div>
      </div>
    </form>
  );
}
