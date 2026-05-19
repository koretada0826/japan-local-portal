"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { Upload, X, Loader2, Star, Building2, Sofa, UtensilsCrossed } from "lucide-react";

type Category = {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  max: number;
  required?: boolean;
};

const CATEGORIES: Category[] = [
  {
    key: "main",
    label: "メイン画像",
    description: "店舗ページのトップに大きく表示されます",
    icon: <Star size={18} fill="currentColor" />,
    max: 1,
    required: true,
  },
  {
    key: "exterior",
    label: "外観の写真",
    description: "お店の外観・看板・入口など",
    icon: <Building2 size={18} />,
    max: 2,
  },
  {
    key: "interior",
    label: "内装・店内の写真",
    description: "客席・カウンター・店内雰囲気など",
    icon: <Sofa size={18} />,
    max: 2,
  },
  {
    key: "menu",
    label: "メニュー・商品の写真",
    description: "看板メニュー・商品例など",
    icon: <UtensilsCrossed size={18} />,
    max: 2,
  },
];

const MAX_SIZE_MB = 5;
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

type CategoryState = Record<string, string[]>;

type Props = {
  name: string;
  sessionIdName?: string;
  onChange?: (urls: string[]) => void;
  className?: string;
};

/**
 * カテゴリ別画像アップロードコンポーネント
 * - メイン / 外観 / 内装 / メニュー の4ゾーン
 * - 全URLを順番通り（メイン → 外観 → 内装 → メニュー）に統合してフォームに渡す
 * - 同セッションIDで全画像が同じStorageフォルダに集まる
 */
export function CategorizedImageUpload({
  name,
  sessionIdName = "uploadSessionId",
  onChange,
  className = "",
}: Props) {
  const sessionId = useMemo(
    () =>
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36),
    []
  );

  const [state, setState] = useState<CategoryState>(
    Object.fromEntries(CATEGORIES.map((c) => [c.key, []]))
  );

  // メイン→外観→内装→メニューの順で全URLをフラット化
  const flatUrls = useMemo(
    () => CATEGORIES.flatMap((c) => state[c.key] ?? []),
    [state]
  );

  const update = useCallback(
    (key: string, urls: string[]) => {
      setState((prev) => {
        const next = { ...prev, [key]: urls };
        const flat = CATEGORIES.flatMap((c) => next[c.key] ?? []);
        onChange?.(flat);
        return next;
      });
    },
    [onChange]
  );

  return (
    <div className={className}>
      {/* hidden inputs for form */}
      <input type="hidden" name={name} value={JSON.stringify(flatUrls)} />
      <input type="hidden" name={sessionIdName} value={sessionId} />

      <div className="space-y-4">
        {CATEGORIES.map((cat) => (
          <CategoryZone
            key={cat.key}
            category={cat}
            urls={state[cat.key] ?? []}
            sessionId={sessionId}
            onChange={(urls) => update(cat.key, urls)}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-soft">
        <span>合計 {flatUrls.length} 枚 / 各カテゴリの上限内</span>
        <span>JPG/PNG/WebP・各 {MAX_SIZE_MB}MB</span>
      </div>
    </div>
  );
}

/**
 * カテゴリ別の単一ドロップゾーン
 */
function CategoryZone({
  category,
  urls,
  sessionId,
  onChange,
}: {
  category: Category;
  urls: string[];
  sessionId: string;
  onChange: (urls: string[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const remaining = category.max - urls.length;
  const isMain = category.key === "main";

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const fileArr = Array.from(files).slice(0, remaining);

      if (fileArr.length === 0) return;

      setIsUploading(true);
      const newUrls: string[] = [];
      for (const file of fileArr) {
        if (!ALLOWED_MIME.includes(file.type)) {
          setError(`${file.name}: JPG/PNG/WebPのみ対応`);
          continue;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          setError(`${file.name}: ${MAX_SIZE_MB}MB超過`);
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
      if (newUrls.length > 0) onChange([...urls, ...newUrls]);
      if (inputRef.current) inputRef.current.value = "";
    },
    [urls, remaining, sessionId, onChange]
  );

  const removeAt = (idx: number) => {
    onChange(urls.filter((_, i) => i !== idx));
    setError(null);
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles]
  );

  return (
    <div
      className={`rounded-xl border bg-white ${
        isMain ? "border-brand/40 shadow-sm" : "border-border"
      } overflow-hidden`}
    >
      {/* ヘッダー */}
      <div
        className={`flex items-center justify-between gap-3 px-4 py-3 border-b border-border ${
          isMain ? "bg-brand-soft" : "bg-surface-soft"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center ${
              isMain ? "bg-brand text-white" : "bg-white text-brand border border-border"
            }`}
          >
            {category.icon}
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">
              {category.label}
              {category.required && (
                <span className="ml-1.5 text-[10px] text-red-500 font-semibold">
                  必須
                </span>
              )}
            </div>
            <div className="text-[11px] text-muted">
              {category.description}
            </div>
          </div>
        </div>
        <div className="text-[11px] text-muted-soft whitespace-nowrap">
          {urls.length} / {category.max} 枚
        </div>
      </div>

      <div className="p-3 md:p-4">
        {/* プレビュー */}
        {urls.length > 0 && (
          <div
            className={`grid gap-2 mb-3 ${
              category.max === 1
                ? "grid-cols-1"
                : "grid-cols-2"
            }`}
          >
            {urls.map((u, i) => (
              <div
                key={u}
                className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={u}
                  alt={`${category.label} ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/85"
                  aria-label={`${category.label} ${i + 1} を削除`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ドロップエリア（残り枠があれば表示） */}
        {remaining > 0 && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-colors p-4 text-center ${
              isDragging
                ? "border-brand bg-brand-soft"
                : "border-border bg-surface-soft hover:border-brand hover:bg-brand-soft/40"
            } ${isUploading ? "pointer-events-none opacity-70" : ""}`}
          >
            <div className="flex flex-col items-center gap-1">
              {isUploading ? (
                <>
                  <Loader2 size={20} className="text-brand animate-spin" />
                  <div className="text-xs font-semibold">アップロード中...</div>
                </>
              ) : (
                <>
                  <Upload size={20} className="text-brand" />
                  <div className="text-xs font-semibold text-foreground">
                    {urls.length === 0
                      ? `ここに「${category.label}」をドラッグ`
                      : `あと ${remaining} 枚追加可能`}
                  </div>
                  <div className="text-[10px] text-muted-soft">
                    またはクリックして選択
                  </div>
                </>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED_MIME.join(",")}
              multiple={remaining > 1}
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
              className="hidden"
            />
          </div>
        )}

        {error && <p className="mt-2 text-[11px] text-red-500">{error}</p>}
      </div>
    </div>
  );
}
