-- リード（無料掲載申込み等）に画像URL列を追加
-- これにより「どの店からの画像か」が確実に紐づく

alter table public.leads
  add column if not exists image_url text;
