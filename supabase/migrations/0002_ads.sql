-- 広告システム用テーブル
-- placement / 優先度 / 期間 で配信制御
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  link_url text not null,
  placement text not null check (placement in ('sidebar_left','sidebar_right')),
  ad_type text not null default 'banner' check (ad_type in ('banner','premium_business')),
  sponsor_name text,
  priority int not null default 0,
  is_active boolean not null default true,
  start_at timestamptz,
  end_at timestamptz,
  -- 計測用
  impressions int not null default 0,
  clicks int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ads_placement_idx on public.ads(placement);
create index if not exists ads_active_idx on public.ads(is_active);
create index if not exists ads_priority_idx on public.ads(priority desc);

alter table public.ads enable row level security;

-- 公開読み：アクティブで配信期間内のもののみ
drop policy if exists "public read active ads" on public.ads;
create policy "public read active ads" on public.ads for select using (
  is_active = true
  and (start_at is null or start_at <= now())
  and (end_at is null or end_at >= now())
);

-- 書き込み・削除はservice_role経由のみ（管理画面）
-- RLSでanonからの書き込みを遮断
