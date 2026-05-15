"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { regions, getAreasByCity, getCitiesByPref } from "@/data/regions";
import {
  getMainCategories,
  getSubCategories,
} from "@/data/categories";

type Variant = "hero" | "compact";

export function SearchForm({ variant = "hero" }: { variant?: Variant }) {
  const router = useRouter();
  const [areaSlug, setAreaSlug] = useState("");
  const [subCategorySlug, setSubCategorySlug] = useState("");

  const groupedAreas = useMemo(() => {
    const groups: Record<string, { value: string; label: string }[]> = {};
    regions
      .filter((r) => r.type === "prefecture")
      .forEach((pref) => {
        const groupKey = pref.name;
        getCitiesByPref(pref.slug).forEach((city) => {
          getAreasByCity(city.slug).forEach((area) => {
            (groups[groupKey] = groups[groupKey] || []).push({
              value: `${pref.slug}/${city.slug}/${area.slug}`,
              label: `${city.name} ${area.name}`,
            });
          });
        });
      });
    return groups;
  }, []);

  const categoryOptions = useMemo(() => {
    const opts: { value: string; label: string; group: string }[] = [];
    getMainCategories().forEach((main) => {
      getSubCategories(main.slug).forEach((sub) => {
        opts.push({
          value: `${main.slug}/${sub.slug}`,
          label: sub.name,
          group: main.name,
        });
      });
    });
    return opts;
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (areaSlug && subCategorySlug) {
      router.push(`/areas/${areaSlug}/categories/${subCategorySlug}`);
    } else if (areaSlug) {
      const [pref, city, area] = areaSlug.split("/");
      router.push(`/areas/${pref}/${city}/${area}`);
    } else if (subCategorySlug) {
      const [main, sub] = subCategorySlug.split("/");
      router.push(`/categories/${main}/${sub}`);
    }
  };

  const isHero = variant === "hero";
  const groupedCategories = categoryOptions.reduce<Record<string, typeof categoryOptions>>(
    (acc, c) => {
      acc[c.group] = acc[c.group] || [];
      acc[c.group].push(c);
      return acc;
    },
    {}
  );

  return (
    <form
      onSubmit={onSubmit}
      className={
        isHero
          ? "bg-white rounded-2xl shadow-lg border border-border p-4 md:p-5"
          : "bg-white rounded-xl border border-border p-3"
      }
    >
      {isHero && (
        <div className="text-sm font-semibold text-foreground mb-3">
          地域とジャンルを選んで探す
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-3">
        <select
          value={areaSlug}
          onChange={(e) => setAreaSlug(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/40"
          aria-label="地域"
        >
          <option value="">エリア・駅名を選択</option>
          {Object.entries(groupedAreas).map(([group, opts]) => (
            <optgroup key={group} label={group}>
              {opts.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <select
          value={subCategorySlug}
          onChange={(e) => setSubCategorySlug(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/40"
          aria-label="業種"
        >
          <option value="">業種・ジャンルを選択</option>
          {Object.entries(groupedCategories).map(([group, opts]) => (
            <optgroup key={group} label={group}>
              {opts.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-hover transition-colors"
        >
          <Search size={16} />
          この条件で探す
        </button>
      </div>
    </form>
  );
}
