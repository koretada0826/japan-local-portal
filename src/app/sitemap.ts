import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config";
import { businesses } from "@/data/businesses";
import { articles } from "@/data/articles";
import {
  getMainCategories,
  getSubCategories,
} from "@/data/categories";
import {
  getPrefectures,
  getCitiesByPref,
  getAreasByCity,
} from "@/data/regions";

// SEO: thin pageをsitemapに含めない（実コンテンツがある組合せのみ）
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1.0 },
    { url: `${base}/search`, priority: 0.7 },
    { url: `${base}/areas`, priority: 0.8 },
    { url: `${base}/categories`, priority: 0.8 },
    { url: `${base}/articles`, priority: 0.7 },
    { url: `${base}/free-listing`, priority: 0.6 },
  ];

  // 47都道府県ページ（カテゴリ一覧と県プロフィールがあるので全部出してOK）
  for (const p of getPrefectures()) {
    urls.push({ url: `${base}/areas/${p.slug}`, priority: 0.7 });
  }

  // 市区町村・駅エリア — 掲載が1件以上ある場合のみ
  const citiesWithBiz = new Set(businesses.map((b) => `${b.prefectureSlug}/${b.citySlug}`));
  const areasWithBiz = new Set(
    businesses.map((b) => `${b.prefectureSlug}/${b.citySlug}/${b.areaSlug}`)
  );

  for (const p of getPrefectures()) {
    for (const c of getCitiesByPref(p.slug)) {
      if (citiesWithBiz.has(`${p.slug}/${c.slug}`)) {
        urls.push({
          url: `${base}/areas/${p.slug}/${c.slug}`,
          priority: 0.6,
        });
      }
      for (const a of getAreasByCity(c.slug)) {
        if (areasWithBiz.has(`${p.slug}/${c.slug}/${a.slug}`)) {
          urls.push({
            url: `${base}/areas/${p.slug}/${c.slug}/${a.slug}`,
            priority: 0.7,
          });
        }
      }
    }
  }

  // 大カテゴリ・中カテゴリ
  for (const m of getMainCategories()) {
    urls.push({ url: `${base}/categories/${m.slug}`, priority: 0.6 });
    for (const s of getSubCategories(m.slug)) {
      urls.push({
        url: `${base}/categories/${m.slug}/${s.slug}`,
        priority: 0.6,
      });
    }
  }

  // 都道府県 × 中カテゴリ（実掲載があるpref×sub組合せのみ）
  const prefSubCombos = new Set(
    businesses.map(
      (b) => `${b.prefectureSlug}/${b.mainCategorySlug}/${b.subCategorySlug}`
    )
  );
  for (const combo of prefSubCombos) {
    const [prefSlug, mainSlug, subSlug] = combo.split("/");
    urls.push({
      url: `${base}/areas/${prefSlug}/categories/${mainSlug}/${subSlug}`,
      priority: 0.8,
    });
  }

  // 駅エリア × 中カテゴリ（実掲載がある組合せのみ）
  const areaSubCombos = new Set(
    businesses.map(
      (b) =>
        `${b.prefectureSlug}/${b.citySlug}/${b.areaSlug}/${b.mainCategorySlug}/${b.subCategorySlug}`
    )
  );
  for (const combo of areaSubCombos) {
    const [prefSlug, citySlug, areaSlug, mainSlug, subSlug] = combo.split("/");
    urls.push({
      url: `${base}/areas/${prefSlug}/${citySlug}/${areaSlug}/categories/${mainSlug}/${subSlug}`,
      priority: 0.9, // 最重要のSEOターゲット
    });
  }

  // 店舗詳細
  for (const b of businesses) {
    if (b.status === "published") {
      urls.push({
        url: `${base}/businesses/${b.slug}`,
        priority: 0.7,
        lastModified: new Date(b.createdAt),
      });
    }
  }

  // 記事
  for (const a of articles) {
    urls.push({
      url: `${base}/articles/${a.slug}`,
      priority: 0.6,
      lastModified: new Date(a.publishedAt),
    });
  }

  return urls;
}
