"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

type Props = {
  // 親フォームに値を伝えるためのhidden inputのname
  name: string;
  // 既存のURL（編集時）
  defaultValue?: string;
  // アップロード完了時のコールバック
  onChange?: (url: string) => void;
  className?: string;
};

const MAX_SIZE_MB = 5;
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

/**
 * ドラッグ&ドロップ対応の画像アップロードコンポーネント
 * - ファイルをドロップ or クリックで選択
 * - /api/upload に送信
 * - 返ってきた公開URLをhidden inputにセット（フォーム送信に乗せる）
 * - プレビュー表示
 */
export function ImageUpload({
  name,
  defaultValue = "",
  onChange,
  className = "",
}: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndUpload = useCallback(
    async (file: File) => {
      setError(null);
      // クライアントサイドのバリデーション
      if (!ALLOWED_MIME.includes(file.type)) {
        setError(`画像形式が対応外です（JPG / PNG / WebPのみ）`);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`ファイルサイズが大きすぎます（最大 ${MAX_SIZE_MB}MB）`);
        return;
      }

      setIsUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.message || data.error || "アップロード失敗");
        }
        setUrl(data.url);
        onChange?.(data.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "アップロードに失敗しました");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) validateAndUpload(file);
    },
    [validateAndUpload]
  );

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndUpload(file);
    },
    [validateAndUpload]
  );

  const clearImage = () => {
    setUrl("");
    setError(null);
    onChange?.("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={className}>
      {/* フォーム送信用のhidden input */}
      <input type="hidden" name={name} value={url} />

      {url ? (
        // プレビューモード
        <div className="relative w-full max-w-sm">
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border bg-surface-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="アップロード画像"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/85 shadow-lg"
            aria-label="画像を削除"
          >
            <X size={16} />
          </button>
          <p className="mt-2 text-xs text-muted-soft truncate">{url}</p>
        </div>
      ) : (
        // ドロップエリア
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors p-8 text-center
            ${
              isDragging
                ? "border-brand bg-brand-soft"
                : "border-border bg-surface-soft hover:border-brand hover:bg-brand-soft/40"
            }
            ${isUploading ? "pointer-events-none opacity-70" : ""}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <>
                <Loader2
                  size={36}
                  className="text-brand animate-spin"
                />
                <div className="text-sm font-semibold text-foreground">
                  アップロード中...
                </div>
              </>
            ) : (
              <>
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    isDragging
                      ? "bg-brand text-white"
                      : "bg-white text-brand border border-border"
                  }`}
                >
                  {isDragging ? (
                    <ImageIcon size={24} />
                  ) : (
                    <Upload size={24} />
                  )}
                </div>
                <div className="text-sm font-semibold text-foreground mt-1">
                  {isDragging
                    ? "ここにドロップして追加"
                    : "ここに画像をドラッグ&ドロップ"}
                </div>
                <div className="text-xs text-muted-soft">
                  またはクリックしてファイルを選択
                </div>
                <div className="text-[11px] text-muted-soft mt-1">
                  JPG / PNG / WebP・最大 {MAX_SIZE_MB}MB
                </div>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_MIME.join(",")}
            onChange={onFileSelect}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
