-- 複数写真対応：leads と businesses に image_urls (text[]) 列を追加
-- 既存の image_url（単一）は「メイン画像」として残し、image_urls は全画像のURLを保持

alter table public.leads
  add column if not exists image_urls text[];

alter table public.businesses
  add column if not exists image_urls text[];

-- 会社ごとに写真をグルーピングするためのセッションID
-- フォーム送信前に発行され、Storageフォルダ名にも使われる
alter table public.leads
  add column if not exists upload_session_id text;
