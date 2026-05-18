"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { Category, Region } from "@/types";

type Props = {
  prefectures: { regionName: string; regionSlug: string; items: Region[] }[];
  mainCategories: Category[];
  subCategories: Category[];
};

/**
 * トップページの検索フォーム
 * 大カテゴリ選択時に中カテゴリのオプションを動的に切り替える
 */
export function HomeSearchForm({
  prefectures,
  mainCategories,
  subCategories,
}: Props) {
  const [main, setMain] = useState("");
  const [sub, setSub] = useState("");

  const subOptions = useMemo(() => {
    if (!main) return [];
    return subCategories.filter((c) => c.parentSlug === main);
  }, [main, subCategories]);

  return (
    <form
      action="/search"
      method="get"
      className="bg-white border border-border rounded-2xl p-4 md:p-5 shadow-sm"
    >
      {/* モバイル: 1列スタック / タブレット: 2列 / PC: 12カラム横並び */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-12">
        {/* キーワード（モバイルは全幅 / SM 2列幅 / PC 4） */}
        <div className="sm:col-span-2 md:col-span-4">
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
              placeholder="例：池袋 カフェ / 渋谷 美容室"
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-border text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
        </div>

        {/* 都道府県 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">
            都道府県
          </label>
          <select
            name="pref"
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
              setSub("");
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

        {/* 中カテゴリ */}
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

        {/* 検索ボタン（モバイルでは全幅で目立たせる） */}
        <div className="sm:col-span-2 md:col-span-2 flex items-end">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 md:py-3 rounded-xl bg-brand text-white font-semibold text-base md:text-sm hover:bg-brand-hover shadow-sm"
          >
            <Search size={16} />
            検索する
          </button>
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-soft text-center md:text-left">
        {main
          ? "中カテゴリで業種をさらに絞り込めます"
          : "大カテゴリを選ぶと中カテゴリも選べるようになります"}
      </div>
    </form>
  );
}
