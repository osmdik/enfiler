# App Router 移行 調査結果（KNOWLEDGE）

作成日: 2026-07-14
対象: enFiler コーポレートサイト
移行の出発点: **第1弾アップグレード完了後**（Next 16 + React 19 + @headlessui/react v2 + framer-motion v12 + next-seo v7 + TypeScript 5.9、Pages Router 構成）を前提とする
参考（依存しない）: 壊れている `feature/change-to-app-router` ブランチ。作り直し前提。

このドキュメントは App Router 移行の裏取り・決定根拠を記録する。実装計画は同ディレクトリの `TODO.md`。
出典は Next.js 公式 App Router migration guide / API リファレンス（context7 経由 `vercel/next.js` canary）および Motion 公式（`motion.dev`）。

---

## 0. 現状（Pages Router）の構成マップ

移行対象の全体像。ファイルは第1弾完了後の想定で記載（framer-motion v12 / headlessui v2 / next-seo v7 化済み）。

| 現状ファイル | 役割 | App Router 移行先 |
| --- | --- | --- |
| `src/pages/_app.tsx` | 全体ラップ。`DefaultSeo`、GTM、`Layout`（Header/Footer）、`AnimatePresence` ページ遷移、`Toaster` | `src/app/layout.tsx`（静的部分）+ `src/app/template.tsx`（遷移アニメ）+ Client Provider |
| `src/pages/_document.tsx` | `<Html lang="ja">`、Google Fonts `<link>`、GTM noscript | `src/app/layout.tsx` の `<html>`/`<body>` + Metadata/next-font/@next/third-parties |
| `src/pages/index.tsx` | `getStaticProps`（news 3件）+ トップ | `src/app/page.tsx`（async Server Component） |
| `src/pages/news.tsx` | `getStaticProps`（news 全件）+ `NewsType` 型 export | `src/app/news/page.tsx`。`NewsType` は `src/types` 等へ移設 |
| `src/pages/news/[id].tsx` | `getStaticPaths` + `getStaticProps` + `NextSeo` | `src/app/news/[id]/page.tsx`（`generateStaticParams` + `generateMetadata`） |
| `src/pages/about.tsx` `service.tsx` `contact.tsx` | 静的ページ + `NextSeo` | `src/app/about/page.tsx` 等（`metadata` export） |
| `src/components/layout/template.tsx` | Header + children + Footer | そのまま流用可（ただし名前が App Router の `template.tsx` と紛らわしい → リネーム推奨） |
| `src/components/layout/header.tsx` | headlessui メニュー（インタラクティブ） | `"use client"` 必須 |
| `src/components/layout/footer.tsx` | 静的フッター | Server Component のまま可 |
| `src/components/ContactForm.tsx` | react-hook-form + fetch + toast | `"use client"` 必須（既にクライアント動作） |
| `src/components/gtm.tsx` | `next/script` の GTM 手書き | `@next/third-parties` の `GoogleTagManager` へ置換推奨（後述） |
| `src/components/date.tsx` | dayjs フォーマット | Server Component 可（表示のみ） |
| `src/components/Spinner.tsx` | 純粋表示 | Server/Client どちらでも可 |
| `src/lib/client.ts` | microCMS SDK | そのまま流用（Server Component から呼ぶ） |

---

## 1. データ取得: getStaticProps/getStaticPaths → Server Component + generateStaticParams（SSG 維持）

出典: `docs/01-app/02-guides/migrating/app-router-migration.mdx`, `generate-metadata.mdx`

### 事実
- App Router では `getStaticProps` は不要。**async Server Component 内で直接 await して取得**する。
- `getStaticPaths` は **`generateStaticParams`** に置換。戻り値の形が簡素化され、`{ paths, fallback }` ではなく **セグメントの配列**（例: `[{ id: '1' }, { id: '2' }]`）を返す。
- **SSG 相当を維持する条件**: 動的関数（`cookies()`/`headers()`/`searchParams`）を使わず、`fetch` を使うなら `cache: 'force-cache'`、または `export const dynamic = 'force-static'` を明示すればビルド時プリレンダリングになる。
- 本サイトは microCMS を **`microcms-js-sdk`（内部 fetch）** で呼ぶ。SDK 経由の fetch は Next のデータキャッシュ制御が効きにくいため、SSG を確実にするには **ルートセグメントに `export const dynamic = 'force-static'`（または `export const revalidate = <秒>` で ISR）を明示**するのが安全。

### 本サイトへの適用
- `news/[id]`: `getStaticPaths`（`client.get({endpoint:"news"})` から `paths` 生成、`fallback:false`）→ `generateStaticParams` で同じく全記事 id を返す。`fallback:false` 相当は **`export const dynamicParams = false`**。
- `getStaticProps`（`client.get({endpoint:"news", contentId:id})`）→ page 本体で `await params` してから `client.get`。**Next 15+ では `params` が Promise 化**しているため `const { id } = await params`。
- `news`（全件）/ `index`（3件）: page 本体で `await client.get(...)`。
- ISR にするか純粋 SSG にするかは論点（TODO.md 論点 B）。microCMS 更新の反映方法に関わる（現状は再デプロイで反映）。

### 未確認
- `microcms-js-sdk` の内部 fetch が Next 16 のデータキャッシュにどう乗るか（`force-static` を付ければビルド時取得で確定するので実害はない見込みだが未検証）。

---

## 2. SEO: next-seo → Metadata API

出典: `generate-metadata.mdx`, blog-starter `layout.tsx`

### 事実
- App Router には **Metadata API** がある。静的な `export const metadata: Metadata = {...}` と、動的な `export async function generateMetadata()` の2形態。`layout.js` / `page.js` から export する。
- `title.template`（next-seo の `titleTemplate` 相当）、`title.default`、`description`、`openGraph`、`twitter`、`icons`、`metadataBase` をサポート。
- **`viewport` と `themeColor` は `metadata` から分離**され、専用の `export const viewport: Viewport = {...}` になっている（Next 14+）。現状 `_app.tsx` の `<meta name="viewport">` はこれに移す。
- favicon は `metadata.icons` またはファイル規約（`app/favicon.ico` / `app/icon.png`）で指定。現状 `public/favicon.ico` を使うなら `icons` で明示。

### next-seo を App Router で使い続けるべきか
- **結論（推奨）: 使わず Metadata API に全面移行する。** next-seo の `NextSeo`/`DefaultSeo` は `<head>` へ副作用注入する **Client 前提の設計**で、App Router の Server Component / ストリーミングと相性が悪く、公式も App Router では Metadata API を推奨。next-seo v6+ は App Router 向けに機能を絞っている（`next-seo` 本体は主に Pages Router 向け、App Router 向けは限定的）。
- 移行後は `next-seo` を **依存から削除可能**（第1弾で v7 に上げるが、App Router 移行完了時点で不要になる）。

### 本サイトへの適用（`_app.tsx` の DefaultSeo → root layout の metadata）
- `titleTemplate` `"%s | 島根県出雲市のホームページ制作 - enFiler | 大嶋大輝"` → `metadata.title.template`
- `defaultTitle` → `metadata.title.default`
- `description` / `openGraph`（type/title/description/site_name/locale/url/images）/ `twitter.cardType: "summary_large_image"` → `metadata.openGraph` / `metadata.twitter`
- `metadataBase: new URL("https://en-filer.com")` を設定し、OGP 画像の相対パス（現状 `./ogp-image.jpg`）を解決させる。**現状の `./` 相対指定はバグの温床**なので移行時に是正。
- 各ページ `NextSeo title="..."` → 各 `page.tsx` の `export const metadata = { title: "..." }`。テンプレートが親から継承される。
- `news/[id]` の `NextSeo title={news.title}` → `generateMetadata` で記事タイトル取得（page 本体と二重 fetch になるが、同一 build 内でキャッシュされる/または `force-static` 前提で許容）。

---

## 3. _app.tsx / _document.tsx → app/layout.tsx（+ template / provider）

出典: `app-router-migration.mdx` step 2, `font.mdx`, third-party-libraries.mdx

### 事実
- `app/layout.tsx`（root layout）が `_app` と `_document` の役割を統合。**`<html>` と `<body>` は自分で書く必要がある**（Next は自動生成しない）。
- root layout は**デフォルト Server Component**。`_app` にあった Context Provider や `AnimatePresence` などクライアント機能は **Client Component に切り出して** layout 内に配置する。
- `layout.tsx` はナビゲーションで**再マウントされない**（状態を保持）。ページ遷移で再マウントさせたい部分は `template.tsx`（後述）。

### Google Fonts: `next/font` へ移行すべきか
- **推奨: `next/font/google` に移行する。** 現状は `_document.tsx` で `<link href="fonts.googleapis.com/...Zen Kaku Gothic New...">` を手書き。`next/font/google` を使うと自己ホスト化・レイアウトシフト削減・プリロード最適化が得られる。
  ```tsx
  import { Zen_Kaku_Gothic_New } from 'next/font/google'
  const zenKaku = Zen_Kaku_Gothic_New({ weight: ['300','400'], subsets: ['latin'], display: 'swap' })
  // <html lang="ja" className={zenKaku.variable / .className}>
  ```
- Tailwind の `fontFamily.zenkaku`（`tailwind.config.js`）と連携するには **CSS 変数方式**（`variable: '--font-zenkaku'`）にし、Tailwind 側を `zenkaku: ['var(--font-zenkaku)']` に変更するのが定石。
- 注意: 日本語フォントはサブセットが大きい。`next/font` の自己ホストで全ウェイトを含めるとビルド時ダウンロードが発生。表示検証必須。`<link>` 方式のまま `layout.tsx` の `<head>` に置く選択肢も残る（論点 D）。

### GTM: noscript + script → @next/third-parties
- **推奨: `@next/third-parties/google` の `GoogleTagManager` に置換。** root layout に `<GoogleTagManager gtmId={...} />` を置くだけで script + noscript を適切に注入。現状の手書き `src/components/gtm.tsx`（`next/script`）と `_document.tsx` の noscript iframe を両方置き換えられる。
- `@next/third-parties` は Next バージョンに追随した別パッケージ（要 `npm i @next/third-parties`）。
- 代替: 現状の `next/script` 手書きコンポーネントを Client Component として流用も可（`strategy="afterInteractive"` は App Router でも有効）。ただし noscript の扱いが分かれるため third-parties 推奨。

### Toaster（react-hot-toast）
- `<Toaster />` は Client Component。root layout 直下に置くには **Client ラッパー**（`"use client"` の Providers コンポーネント）に入れて配置する。

---

## 4. ページ遷移の exit アニメーション（最大の難所）

出典: `template.mdx`（Next 公式）, `motion.dev/docs/react-animate-presence`（Motion 公式）

### 問題の本質
- 現状 `_app.tsx` は `<AnimatePresence mode="wait">` + `<motion.div key={router.asPath}>` で **入場（initial→animate）と退場（exit）両方のフェード**を実現している。
- App Router では:
  - `layout.tsx` はナビゲーションで**再マウントされない** → ここに `AnimatePresence` を置いても子の key 変化を検知できず exit が焼けない。
  - `template.tsx` は**セグメント変化で再マウントされる**（key が自動付与される）が、これは**新しいページが即マウントされる**挙動であり、**古いページの DOM は既に置き換わっている**ため `AnimatePresence` の exit が発火しない（退場させる対象が残っていない）。
  - これは App Router の設計上の既知の制約で、**exit アニメーションは「そのままでは」実現困難**。

### 実現方式（3案。TODO.md 論点 A で比較）
1. **入場のみ（exit なし）** — `template.tsx` に `motion.div` を置き `initial`/`animate` のみ。`template` が遷移ごとに再マウントするので**フェードイン**は自然に効く。exit は諦める。実装が最も単純・堅牢。
2. **"FrozenRouter" コミュニティパターン** — `template.tsx`（Client）で `usePathname()` を key に `<AnimatePresence mode="wait">` を使い、内部で `LayoutRouterContext`（`next/dist/shared/lib/app-router-context`）の値を遷移中フリーズさせるラッパーを噛ませ、**退場中は古いツリーを保持**する。exit + enter 両方が焼ける。現状の見た目を最も忠実に再現できるが、**Next の内部 API に依存**し将来のバージョンで壊れるリスクがある（非公式）。
3. **View Transitions API / Next 実験機能または CSS** — ブラウザの View Transitions を使う。Next にも実験的サポートあり。framer-motion を外せるが、対応ブラウザ・実験機能の安定性が未知（Next 16 の安定度は未確認）。

### 事実の裏取り
- `template.mdx`: 「Templates receive a unique key for their own segment level. They remount when that segment changes.」→ template は再マウントするので**入場アニメは公式に実現可能**。
- Motion 公式: `AnimatePresence` は「直接の子の削除（key 変化/条件）」を検知して exit を焼く。App Router の template は削除ではなく置換なので、**素の template + AnimatePresence では exit が焼けない**ことと整合。

### 未確認
- 案2 FrozenRouter が **Next 16 + React 19** で動作するか（`LayoutRouterContext` の export パスや形が変わっている可能性。要検証・非公式）。
- 案3 View Transitions の Next 16 での安定度。

---

## 5. `"use client"` 境界の切り分け

出典: `app-router-migration.mdx`（Context は Client へ）, third-party-libraries.mdx

| コンポーネント | 区分 | 理由 |
| --- | --- | --- |
| `app/layout.tsx` | **Server** | 静的シェル。metadata / font / GTM を配置 |
| `app/template.tsx`（遷移アニメ） | **Client** | framer-motion / `usePathname` を使う |
| Providers（Toaster ラッパー等） | **Client** | react-hot-toast の `Toaster` |
| `header.tsx` | **Client** | headlessui v2 の Menu（インタラクティブ・状態あり） |
| `footer.tsx` | Server | 静的 |
| `ContactForm.tsx` | **Client** | react-hook-form / fetch / toast / イベント |
| `page.tsx`（各ページ） | **Server**（async） | データ取得・metadata。静的ページも Server のままでよい |
| `date.tsx` / `Spinner.tsx` | Server 可 | 表示のみ（Spinner は Client 側で使われるが自身は純表示） |
| `lib/client.ts` | Server 専用 | `API_KEY` を使うため**絶対にクライアントに漏らさない**（Server Component / `page.tsx` からのみ import） |

**原則**: `"use client"` はツリーの**葉側にできるだけ寄せる**。layout/page は Server のまま、インタラクティブな部分（header, form, 遷移アニメ）だけを Client 島にする。

---

## 6. src/pages と src/app の共存移行

出典: `app-router-migration.mdx`（「Keep _app/_document during migration」）

### 事実
- `pages/` と `app/` は**同一プロジェクトで共存可能**。App Router が優先されるが、**同一ルートを両方に定義すると衝突（ビルドエラー）**する。
- `app/layout.tsx` のスタイルは `pages/*` には適用されない。移行中は `_app`/`_document` を**残す**べき（消すと Pages 側が壊れる）。
- ルート単位で段階移行できる（例: まず `/about` だけ `app/about/page.tsx` にし、`pages/about.tsx` を削除）。

### 本サイトへの示唆
- サイトが小さい（6 ルート）ため、**共存期間を短くする**か**一括移行**が現実的。共存は「グローバル資産（layout/font/GTM/遷移アニメ）を app 側と pages 側で二重管理する」コストが高い。
- 共存する場合の注意: グローバル遷移アニメ（framer-motion）は `_app`（Pages）と `template`（App）で別実装になり、移行途中はページをまたぐ遷移でアニメが不連続になる。

---

## 7. 依存パッケージへの影響（第1弾完了状態からの差分）

| パッケージ | App Router 移行での扱い |
| --- | --- |
| `next-seo` | **不要化 → 削除**（Metadata API へ全面移行） |
| `@next/third-parties` | **新規追加**（GTM 用、推奨採用時） |
| `framer-motion`(v12) | 継続。ただし遷移アニメの実装方式が変わる（template/Client 化） |
| `@headlessui/react`(v2) | 継続。header を `"use client"` 化 |
| `next/font` | **新規利用**（Google Fonts 自己ホスト、採用時）。追加インストール不要（next 同梱） |
| `microcms-js-sdk` | 継続。Server Component から呼ぶ |
| `next-sitemap` | 継続。App Router でも postbuild で動作（ルート走査はビルド出力ベース） |
| `react-hot-toast` | 継続。Client Provider 経由で配置 |
| `dayjs` / `@heroicons/react` | 影響なし |

## 8. 不明・未検証事項（推測で埋めていない）

- **FrozenRouter パターンの Next 16 / React 19 動作**（案2）: 非公式・内部 API 依存。要 PoC。
- **View Transitions（案3）の Next 16 安定度**: 未確認。
- **`microcms-js-sdk` 内部 fetch と Next データキャッシュの相互作用**: `force-static` 明示で回避する前提だが未検証。
- **`next/font/google` での "Zen Kaku Gothic New" 全ウェイト自己ホスト時のビルド時間・表示**: 未検証。日本語フォントはサイズ大。
- **next-sitemap が app ルートを正しく列挙するか**: postbuild はビルド成果物ベースのため問題ない見込みだが未検証。
- **Vercel の設定**（Node/ビルド/環境変数）: リポジトリから確認不能。
- 第1弾（Opus 実装中）の**最終的な依存バージョン確定値**: 本計画は想定前提。ズレたら再調整。

## 9. 参照した一次情報

- Next.js App Router migration guide: `docs/01-app/02-guides/migrating/app-router-migration.mdx`
- Metadata API: `docs/01-app/03-api-reference/04-functions/generate-metadata.mdx`, `metadata-interface.ts`
- template 再マウント挙動: `docs/01-app/03-api-reference/03-file-conventions/template.mdx`
- next/font: `docs/01-app/03-api-reference/02-components/font.mdx`
- GTM / third-parties: `docs/01-app/02-guides/third-party-libraries.mdx`
- Motion（AnimatePresence / exit）: `motion.dev/docs/react-animate-presence`
（すべて context7 経由で 2026-07-14 に確認）
