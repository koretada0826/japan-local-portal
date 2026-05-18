-- 業者画像アップロード用のStorage Bucket
-- 公開バケット（読み取りは誰でも可能）
-- 書き込みはAPI経由（service_role）のみ

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'business-images',
  'business-images',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- 公開読み取りポリシー（business-images バケットのみ）
drop policy if exists "Public read business-images" on storage.objects;
create policy "Public read business-images" on storage.objects
  for select using (bucket_id = 'business-images');

-- 書き込みはservice_roleのみ（既定でanonからは弾かれる）
-- 念のため明示的にinsert/update/deleteのanonポリシーを置かない
