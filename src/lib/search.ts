import { businesses } from "@/data/businesses";
import type { Business } from "@/types";

export type SearchFilters = {
  q?: string;
  prefectureSlug?: string;
  citySlug?: string;
  areaSlug?: string;
  mainCategorySlug?: string;
  subCategorySlug?: string;
  sort?: "recommend" | "new";
};

export function searchBusinesses(filters: SearchFilters): Business[] {
  const q = (filters.q ?? "").trim().toLowerCase();

  let results = businesses.filter((b) => {
    if (b.status !== "published") return false;
    if (filters.prefectureSlug && b.prefectureSlug !== filters.prefectureSlug)
      return false;
    if (filters.citySlug && b.citySlug !== filters.citySlug) return false;
    if (filters.areaSlug && b.areaSlug !== filters.areaSlug) return false;
    if (
      filters.mainCategorySlug &&
      b.mainCategorySlug !== filters.mainCategorySlug
    )
      return false;
    if (
      filters.subCategorySlug &&
      b.subCategorySlug !== filters.subCategorySlug
    )
      return false;

    if (q) {
      const hay = [
        b.name,
        b.shortDescription,
        b.description,
        b.address,
        ...b.features,
        ...(b.services ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  if (filters.sort === "new") {
    results = results.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else {
    results = results.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return a.displayOrder - b.displayOrder;
    });
  }

  return results;
}
