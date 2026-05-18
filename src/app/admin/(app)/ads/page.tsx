import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { readAds, appendAd, updateAd, deleteAd } from "@/lib/adStore";
import { adInputSchema } from "@/lib/adSchemas";
import type { AdPlacement, AdType } from "@/types";

const placementLabels: Record<AdPlacement, string> = {
  sidebar_left: "左サイド広告（縦一列・正方形）",
  sidebar_right: "右サイド広告（縦一列・正方形）",
};

const adTypeLabels: Record<AdType, string> = {
  banner: "バナー広告",
  premium_business: "プレミアム掲載",
};

async function assertAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("Unauthorized");
}

async function createAdAction(formData: FormData) {
  "use server";
  await assertAdmin();

  const raw = {
    title: formData.get("title"),
    imageUrl: formData.get("imageUrl"),
    linkUrl: formData.get("linkUrl"),
    placement: formData.get("placement"),
    adType: formData.get("adType"),
    sponsorName: formData.get("sponsorName") ?? "",
    priority: formData.get("priority") ?? 0,
    isActive: formData.get("isActive") === "on",
    startAt: formData.get("startAt") ?? "",
    endAt: formData.get("endAt") ?? "",
  };

  const parsed = adInputSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn("[admin/ads] invalid input:", parsed.error.issues);
    return;
  }

  await appendAd({
    title: parsed.data.title,
    imageUrl: parsed.data.imageUrl,
    linkUrl: parsed.data.linkUrl,
    placement: parsed.data.placement,
    adType: parsed.data.adType,
    sponsorName: parsed.data.sponsorName || undefined,
    priority: parsed.data.priority,
    isActive: parsed.data.isActive,
    startAt: parsed.data.startAt || undefined,
    endAt: parsed.data.endAt || undefined,
  });
  revalidatePath("/admin/ads");
  revalidatePath("/", "layout");
}

async function toggleAdAction(formData: FormData) {
  "use server";
  await assertAdmin();
  const id = String(formData.get("id"));
  const nextActive = String(formData.get("nextActive")) === "true";
  await updateAd(id, { isActive: nextActive });
  revalidatePath("/admin/ads");
  revalidatePath("/", "layout");
}

async function deleteAdAction(formData: FormData) {
  "use server";
  await assertAdmin();
  const id = String(formData.get("id"));
  await deleteAd(id);
  revalidatePath("/admin/ads");
  revalidatePath("/", "layout");
}

export default async function AdminAdsPage() {
  const ads = await readAds();

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold">広告管理</h1>
        <p className="text-sm text-muted mt-1">
          ポータル内に表示する広告バナーを追加・編集できます。表示場所と優先度で出し分けます。
        </p>
        <ul className="mt-3 text-xs text-muted-soft list-disc pl-5 space-y-1">
          <li>同じ表示場所に複数登録した場合、優先度が高いものが表示されます。</li>
          <li>表示期間（開始/終了）を空欄にすると常時表示です。</li>
          <li>外部URLは http/https のみ受け付けます（セキュリティ対策）。</li>
        </ul>
      </header>

      <section className="bg-white rounded-2xl border border-border p-5 md:p-6">
        <h2 className="font-bold mb-4">新しい広告を追加</h2>
        <form action={createAdAction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="タイトル" required>
            <input
              type="text"
              name="title"
              required
              maxLength={120}
              placeholder="例：地域密着のホームページ制作 30万円〜"
              className="form-input"
            />
          </Field>

          <Field label="広告主名">
            <input
              type="text"
              name="sponsorName"
              maxLength={80}
              placeholder="例：まちセレクト 制作チーム"
              className="form-input"
            />
          </Field>

          <Field label="画像URL（https://）" required>
            <input
              type="url"
              name="imageUrl"
              required
              pattern="https?://.+"
              placeholder="https://example.com/banner.jpg"
              className="form-input"
            />
          </Field>

          <Field label="クリック先URL（https://）" required>
            <input
              type="url"
              name="linkUrl"
              required
              pattern="https?://.+"
              placeholder="https://example.com/lp"
              className="form-input"
            />
          </Field>

          <Field label="表示場所" required>
            <select name="placement" required defaultValue="home_hero" className="form-input">
              {Object.entries(placementLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>

          <Field label="広告タイプ" required>
            <select name="adType" required defaultValue="banner" className="form-input">
              {Object.entries(adTypeLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>

          <Field label="優先度（数字が大きいほど優先表示・0-1000）">
            <input
              type="number"
              name="priority"
              min={0}
              max={1000}
              defaultValue={50}
              className="form-input"
            />
          </Field>

          <Field label="表示開始日時（任意）">
            <input type="datetime-local" name="startAt" className="form-input" />
          </Field>

          <Field label="表示終了日時（任意）">
            <input type="datetime-local" name="endAt" className="form-input" />
          </Field>

          <div className="flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              defaultChecked
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm">
              すぐに表示する（有効）
            </label>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover"
            >
              広告を追加
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-bold">登録済み広告</h2>
          <div className="text-xs text-muted-soft">全 {ads.length} 件</div>
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-soft text-xs uppercase text-muted">
              <tr>
                <th className="text-left px-4 py-3">プレビュー</th>
                <th className="text-left px-4 py-3">タイトル / 広告主</th>
                <th className="text-left px-4 py-3">表示場所</th>
                <th className="text-left px-4 py-3">タイプ</th>
                <th className="text-right px-4 py-3">優先度</th>
                <th className="text-center px-4 py-3">状態</th>
                <th className="text-right px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ads.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-muted-soft"
                  >
                    まだ広告がありません。上のフォームから追加してください。
                  </td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-surface-soft align-middle">
                    <td className="px-4 py-3">
                      <div className="w-24 h-14 bg-surface-soft rounded overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold line-clamp-1">{ad.title}</div>
                      <div className="text-xs text-muted-soft line-clamp-1">
                        {ad.sponsorName ?? "—"}
                      </div>
                      <a
                        href={ad.linkUrl}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="text-xs text-brand hover:underline"
                      >
                        遷移先を開く
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {placementLabels[ad.placement]}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {adTypeLabels[ad.adType]}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {ad.priority}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {ad.isActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-brand-soft text-brand text-xs">
                          表示中
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-surface-soft text-muted text-xs">
                          停止中
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <form action={toggleAdAction} className="inline">
                        <input type="hidden" name="id" value={ad.id} />
                        <input
                          type="hidden"
                          name="nextActive"
                          value={ad.isActive ? "false" : "true"}
                        />
                        <button
                          type="submit"
                          className="text-xs text-brand hover:underline mr-3"
                        >
                          {ad.isActive ? "停止" : "再開"}
                        </button>
                      </form>
                      <form action={deleteAdAction} className="inline">
                        <input type="hidden" name="id" value={ad.id} />
                        <button
                          type="submit"
                          className="text-xs text-red-500 hover:underline"
                        >
                          削除
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-muted mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
