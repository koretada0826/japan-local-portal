"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Star } from "lucide-react";

type Props = {
  // 親フォームに値を伝える hidden input の name（JSON配列としてシリアライズ）
  name: string;
  // セッションID用 hidden input の name（Supabase Storage フォルダに使う）
  sessionIdName?: string;
  // アップロード完了時のコールバック（全URLの配列）
  onChange?: (urls: string[]) => void;
  // 最大枚数
  maxFiles?: number;
  className?: string;
};

const MAX_SIZE_MB = 5;
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

/**
 * 複数画像アップロードコンポーネント
 * - 1セッション内の写真は同じフォルダに格納（店ごとにまとまる）
 * - 1枚目が自動的にメイン画像
 * - 並び替え・削除・追加が可能
 */
export function MultiImageUpload({
  name,
  sessionIdName = "uploadSessionId",
  onChange,
  maxFiles = 5,
  className = "",
}: Props) {
  // セッションIDをマウント時に1回だけ生成
  const sessionId = useMemo(
    () =>
      // crypto.randomUUID() を使う（モダンブラウザ標準）
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36),
    []
  );

  const [urls, setUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateUrls = useCallback(
    (next: string[]) => {
      setUrls(next);
      onChange?.(next);
    },
    [onChange]
  );

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const fileArr = Array.from(files);

      // 残り枚数チェック
      const remaining = maxFiles - urls.length;
      if (remaining <= 0) {
        setError(`これ以上アップロードできません（最大 ${maxFiles} 枚）`);
        return;
      }
      const toUpload = fileArr.slice(0, remaining);
      if (fileArr.length > remaining) {
        setError(
          `${fileArr.length}枚選択されましたが、残り ${remaining} 枚までです`
        );
      }

      setIsUploading(true);
      const newUrls: string[] = [];
      for (const file of toUpload) {
        // クライアントサイドバリデーション
        if (!ALLOWED_MIME.includes(file.type)) {
          setError(`${file.name}: 形式が対応外（JPG/PNG/WebPのみ）`);
          continue;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          setError(`${file.name}: ${MAX_SIZE_MB}MBを超えています`);
          continue;
        }
        try {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("sessionId", sessionId);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (!res.ok || !data.ok) {
            throw new Error(data.message || data.error || "送信失敗");
          }
          newUrls.push(data.url);
        } catch (e) {
          setError(
            `${file.name}: ${
              e instanceof Error ? e.message : "アップロード失敗"
            }`
          );
        }
      }
      setIsUploading(false);
      if (newUrls.length > 0) updateUrls([...urls, ...newUrls]);
      if (inputRef.current) inputRef.current.value = "";
    },
    [urls, maxFiles, sessionId, updateUrls]
  );

  const removeAt = (idx: number) => {
    updateUrls(urls.filter((_, i) => i !== idx));
    setError(null);
  };

  const moveToMain = (idx: number) => {
    if (idx === 0) return;
    const next = [...urls];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    updateUrls(next);
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length > 0) uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles]
  );

  return (
    <div className={className}>
      {/* hidden inputs for form submission */}
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      <input type="hidden" name={sessionIdName} value={sessionId} />

      {/* プレビューグリッド */}
      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
          {urls.map((u, i) => (
            <div
              key={u}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 group ${
                i === 0 ? "border-brand" : "border-border"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={u}
                alt={`写真 ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand text-white inline-flex items-center gap-1">
                  <Star size={10} fill="currentColor" />
                  メイン
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-90 hover:opacity-100"
                aria-label={`写真 ${i + 1} を削除`}
              >
                <X size={12} />
              </button>
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => moveToMain(i)}
                  className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-1 rounded bg-white/95 text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  メインにする
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ドロップエリア（残り枚数がある時のみ表示） */}
      {urls.length < maxFiles && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors p-6 text-center
            ${
              isDragging
                ? "border-brand bg-brand-soft"
                : "border-border bg-surface-soft hover:border-brand hover:bg-brand-soft/40"
            }
            ${isUploading ? "pointer-events-none opacity-70" : ""}
          `}
        >
          <div className="flex flex-col items-center gap-1.5">
            {isUploading ? (
              <>
                <Loader2
                  size={28}
                  className="text-brand animate-spin"
                />
                <div className="text-sm font-semibold">
                  アップロード中...
                </div>
              </>
            ) : (
              <>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isDragging
                      ? "bg-brand text-white"
                      : "bg-white text-brand border border-border"
                  }`}
                >
                  {isDragging ? (
                    <ImageIcon size={20} />
                  ) : (
                    <Upload size={20} />
                  )}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {urls.length === 0
                    ? "ここに画像をドラッグ&ドロップ（複数選択OK）"
                    : `あと ${maxFiles - urls.length} 枚アップロード可能`}
                </div>
                <div className="text-xs text-muted-soft">
                  またはクリックしてファイルを選択
                </div>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_MIME.join(",")}
            multiple
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            className="hidden"
          />
        </div>
      )}

      <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-muted-soft">
        <span>
          {urls.length}/{maxFiles} 枚 ・ JPG/PNG/WebP ・ 各 {MAX_SIZE_MB}MB
        </span>
        {urls.length > 0 && (
          <span>★メイン画像は店舗カードに表示されます</span>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
