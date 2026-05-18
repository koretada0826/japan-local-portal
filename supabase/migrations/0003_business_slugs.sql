-- アプリ側で slug ベースで地域・カテゴリを参照するため、businessesテーブルに slug列を追加
-- 既存の region_id, category_id (UUID) は残す（将来正規化用）

alter table public.businesses
  add column if not exists prefecture_slug text,
  add column if not exists city_slug text,
  add column if not exists area_slug text,
  add column if not exists main_category_slug text,
  add column if not exists sub_category_slug text;

create index if not exists businesses_pref_slug_idx on public.businesses(prefecture_slug);
create index if not exists businesses_main_cat_slug_idx on public.businesses(main_category_slug);
