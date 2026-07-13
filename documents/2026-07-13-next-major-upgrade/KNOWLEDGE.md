# Next.js メジャーアップグレード調査結果（KNOWLEDGE）

作成日: 2026-07-13
対象: enFiler コーポレートサイト（`main` ブランチ / Next 13.0.7 / Pages Router / SSG のみ）
目標: Next 16 系（調査時点の latest: `next@16.2.10`）

このドキュメントは調査で得た事実・根拠・決定理由を記録する。実装計画は同ディレクトリの `TODO.md` を参照。

---

## 1. 各メジャーバージョンの破壊的変更（公式ドキュメントで裏取り済み）

出典: Next.js 公式 upgrade ガイド（context7 経由で `vercel/next.js` canary ドキュメントを確認）

### 13 → 14（version-14.mdx）

| 変更 | 本リポジトリへの影響 |
| --- | --- |
| 最低 Node.js が 16.14 → 18.17 | なし（Node 24.18.0 固定済み） |
| `next export` コマンド削除（`output: 'export'` へ） | なし（`next export` 未使用。Vercel デプロイの通常 SSG） |
| `ImageResponse` の import が `next/server` → `next/og` | なし（未使用） |
| **`@next/font` パッケージ完全削除**（`next/font` へ統合） | **package.json に `@next/font: 13.0.7` が残っているが、ソースコードでの import は 0 件**（rg で確認）。フォントは `_document.tsx` の Google Fonts `<link>` で読込。→ 依存削除のみで対応可 |
| `next-swc` の WASM ターゲット削除 | なし |

### 14 → 15（version-15.mdx）

| 変更 | 本リポジトリへの影響 |
| --- | --- |
| **async request APIs**（`params` / `searchParams` / `cookies()` / `headers()` が Promise 化） | **App Router のみの変更**。Pages Router の `getStaticProps(context)` / `getStaticPaths` は対象外 → 影響なし |
| **`fetch` がデフォルト非キャッシュに**（`cache: 'force-cache'` でオプトイン） | App Router の Route Handler / Server Component の話。Pages Router の `getStaticProps` 内 microCMS SDK 呼び出しはビルド時実行で従来どおり → 影響なし |
| App Router は React 19 が必要。**Pages Router は React 18 継続サポート** | Pages Router 維持なら React 18.2.0 のままで可 |
| `@next/font` import の残骸は `next/font` へ書き換え | 上記のとおり import 自体がないため作業なし |

### 15 → 16（version-16.mdx）

| 変更 | 本リポジトリへの影響 |
| --- | --- |
| **最低 Node.js 20.9.0**（Node 18 サポート終了） | なし（Node 24.x） |
| **最低 TypeScript 5.1.0** | **要対応**: 現在 `typescript: 4.9.4` → 5.x へ更新必須 |
| ブラウザ要件: Chrome/Edge/Firefox 111+、Safari 16.4+ | 静的コーポレートサイトとして許容範囲。ユーザー判断事項 |
| **Turbopack がデフォルト**（dev / build 両方）。カスタム webpack 設定があるとビルド失敗。`--webpack` フラグでオプトアウト可 | `next.config.js` は `reactStrictMode: true` のみでカスタム webpack 設定なし → そのまま Turbopack で通る見込み。問題時は `next build --webpack` に退避可 |
| Turbopack は Sass の `~`（チルダ）プレフィックス import 非対応 | `src/styles/*.scss` は `@use 'base'` 等の相対参照のみで `~` 未使用（確認済み）→ 影響なし |
| **`next lint` コマンド削除** | `package.json` の lint script は `eslint --ext .ts,.tsx src` の直接実行で `next lint` 未使用 → 影響なし |
| AMP サポート削除 | なし（未使用） |
| `middleware.ts` → `proxy.ts` へリネーム（deprecated） | なし（middleware 未使用） |
| `next/link` の `legacyBehavior` は deprecated（将来削除） | なし（全 Link が新スタイル。`legacyBehavior` 未使用） |
| `images.imageSizes` のデフォルトから `16` を削除 | 影響なし（16px 相当の画像未使用、`quality` prop も未使用） |
| React 要件: **peerDependencies は `react: ^18.2.0 || ^19.0.0`**（npm registry の `next@16.2.10` で確認） | **Pages Router なら React 18.2.0 のまま Next 16 に上げられる**。App Router は React 19 系がフレームワーク側にバンドルされる |

**Next 16 でも Pages Router はサポート継続**（公式 docs に Pages Router 向けガイドが存在）。「削除予定」の明言はドキュメント上確認できなかった。

### React 18 → 19（react.dev の React 19 Upgrade Guide）

削除された API と本リポジトリの該当状況:

| React 19 で削除 | 本リポジトリ |
| --- | --- |
| 関数コンポーネントの `propTypes` / `defaultProps` | 未使用（TypeScript の型 + デフォルト引数で書かれている） |
| Legacy Context（`contextTypes` / `getChildContext`） | 未使用（クラスコンポーネント自体なし） |
| String refs | 未使用 |
| `ReactDOM.render` / `hydrate` 等 | 未使用（Next が抽象化） |

→ **アプリコード自体は React 19 化しても直接の書き換えはほぼ不要**。リスクは後述のサードパーティ依存の peer dependency 側にある。

---

## 2. 依存パッケージの互換性（npm registry で peerDependencies を確認）

調査日: 2026-07-13。`npm view <pkg> peerDependencies` の実測値。

| パッケージ | 現在 | 最新 | React 19 対応 | Next 16 対応 | 備考 |
| --- | --- | --- | --- | --- | --- |
| `next-seo` | 5.15.0 | 7.2.0 | v5: `react >=16` / v7: `react >=18.2` | v5 peer: `next >=9.0.0`（衝突なし）/ v7: `next >=13.4` | **v5 のままでも peer 上は Next 16 + React 18/19 で衝突しない**。ただし v5 の Next 16 実動作は未検証（不明） |
| `framer-motion` | 9.x（^9.0.2） | 12.42.2 | **v9 peer は `react ^18.0.0` のみ → React 19 なら v12 必須** | Next 依存なし | v12 peer は `^18 || ^19`。React 18 維持なら v9 据え置きも v12 化も可 |
| `@headlessui/react` | 1.7.x | 2.2.10 | **v1.7 peer は `^16 || ^17 || ^18` → React 19 では peer 違反** | Next 依存なし | React 19 化するなら v2 必須。**v1→v2 は API 破壊的変更あり**（`Menu.Button` → `MenuButton` 等）→ `src/components/layout/header.tsx` の書き換えが必要 |
| `react-hot-toast` | 2.4.1 | 2.6.0 | `react >=16`（v2.6） | — | マイナー更新で追随可 |
| `@heroicons/react` | 2.0.x | 2.2.0 | `react >= 16 || ^19.0.0-rc` | — | 問題なし |
| `next-sitemap` | 3.1.x | 4.2.3 | — | peer `next: *`（v3/v4 とも） | v3 のままでも peer 衝突なし。v4 は ESM 化等あり。実動作は postbuild で要確認 |
| `microcms-js-sdk` | 2.3.2 | 3.4.0 | peer なし | peer なし | fetch ベースの単純クライアント。据え置き可、v3 化は任意 |
| `eslint-config-next` | 13.0.7 | 16.2.10 | — | **v16 は `eslint >=9.0.0` を要求** | **重要な発見: `.eslintrc.json` は `eslint-config-next` を extends していない**（自前の typescript-eslint + react 構成）。つまり現状このパッケージは実質未使用 |
| `typescript` | 4.9.4 | 7.0.2（5.x 系最新は 5.9.3） | — | **Next 16 は TS >= 5.1.0 必須** | latest の 7.0.2（ネイティブコンパイラ系）の Next 16 対応状況は未確認（不明）→ 安全側で **5.9.3** を推奨 |
| `react` / `react-dom` | 18.2.0 | 19.2.7 | — | Next 16 peer は `^18.2.0 || ^19.0.0` | React 18 維持と 19 移行の両方が成立する |

### 未使用依存（削除候補、rg で全ソース確認済み）

- `@next/font: 13.0.7` — import 0 件（Next 14 で削除済みパッケージ。残すと将来の `npm ls` で不整合）
- `vivus: ^0.4.6` + `@types/vivus: ^0.4.4` — import 0 件
- `eslint-config-next: 13.0.7` — `.eslintrc.json` で未参照（`next/core-web-vitals` 等を extends していない）。削除するか、逆にこの機会に v16 + ESLint 9 flat config で正式導入するかは選択（TODO.md 論点 D）

---

## 3. リポジトリ内の影響箇所一覧（ファイル:行）

### 変更が必要な箇所

| ファイル | 内容 |
| --- | --- |
| `package.json:20` | `@next/font` 削除（未使用） |
| `package.json:29` | `next: 13.0.7` → `16.2.10` |
| `package.json:26` | `eslint-config-next: 13.0.7` → 削除 or 16 系 + ESLint 9 化（論点 D） |
| `package.json:33` | `typescript: 4.9.4` → `5.9.3`（推奨） |
| `package.json:21-23` | `@types/node`（18 系→ Node 24 対応の 24 系推奨）、`@types/react` / `@types/react-dom`（React 18 維持なら 18 系最新、19 なら 19 系） |
| `package.json:34,38` | `vivus` / `@types/vivus` 削除（未使用） |
| `tsconfig.json` | `next dev`/`next build` 初回実行時に Next が自動修正を提案・適用する見込み（`moduleResolution: "bundler"` 等）。`target: "es5"` は動作するが古い。自動変更をそのままコミットする方針 |

### Pages Router 維持なら「変更不要」と確認済みの箇所

| ファイル:行 | 内容 | 判定理由 |
| --- | --- | --- |
| `src/pages/index.tsx:8` / `src/pages/news.tsx:21` / `src/pages/news/[id].tsx:8,16` | `getStaticProps` / `getStaticPaths` | Pages Router API は Next 16 でも従来どおり |
| `src/pages/_app.tsx` | `AppProps` / `DefaultSeo` / `AnimatePresence`（`router.asPath` キー）/ `Toaster` | Pages Router の `_app` 構造は維持される |
| `src/pages/_document.tsx` | `Html`/`Head`/`Main`/`NextScript`、Google Fonts `<link>`、GTM noscript | 同上 |
| `src/pages/index.tsx:32,43` / `src/components/layout/header.tsx:19` | `next/image`（ローカル画像のみ、`quality` 未使用） | v16 の image デフォルト変更（imageSizes から 16 削除等）の影響なし |
| 全 `next/link` 使用箇所（index/news/[id]/service/header） | 新スタイル（`<a>` 子要素なし、`legacyBehavior` なし） | v13 時点で新形式に移行済み |
| `src/components/gtm.tsx` | `next/script` の `strategy="afterInteractive"` | 変更なし |
| `src/lib/client.ts` | microCMS クライアント（`SERVICE_DOMAIN` / `API_KEY`） | ビルド時にのみ実行。挙動変更なし |
| `src/styles/*.scss` | `@use` の相対参照のみ | Turbopack の `~` 非対応の影響なし |
| `next.config.js` | `reactStrictMode: true` のみ | カスタム webpack 設定なし → Turbopack デフォルト化で失敗しない見込み |
| `next-sitemap.config.js` | siteUrl / robots 生成 | next-sitemap は postbuild の独立プロセス。peer は `next: *` |

### React 19 に上げる場合のみ変更が必要な箇所

| ファイル:行 | 内容 |
| --- | --- |
| `src/components/layout/header.tsx:4,28-71` | `@headlessui/react` v1 の `Menu` / `Menu.Button` / `Menu.Items` / `Menu.Item` / `Transition` → v2 の `MenuButton` / `MenuItems` / `MenuItem` 等へ書き換え |
| `src/pages/_app.tsx:10,54-66` | `framer-motion` v9 → v12（`motion` パッケージ）。`AnimatePresence mode="wait"` + exit アニメーションの動作検証が必要 |
| `package.json` | `react` / `react-dom` / `@types/react` / `@types/react-dom` を 19 系へ |

---

## 4. 主要な決定材料（要点）

1. **このサイトは Next のメジャーアップグレードの「破壊的変更にほぼ当たらない」構成**。
   - Pages Router + SSG のみ、middleware なし、API Routes なし、カスタム webpack なし、`next lint` 不使用、`legacyBehavior` 不使用、`@next/font` は未使用の残骸。
   - 13→16 の実質的な必須作業は「依存バージョン更新 + TypeScript 5 化 + ビルド検証」に収束する。
2. **React 18 のまま Next 16 に上げられる**（`next@16.2.10` の peer は `^18.2.0 || ^19.0.0`）。React 19 化は Headless UI v2 / framer-motion v12 への同時メジャーアップを誘発するため、切り離すとリスクが下がる。
3. **段階アップグレード（13→14→15→16）の利点が薄い**。中間バージョンの breaking changes（async request APIs、fetch キャッシュ等）がすべて App Router 向けであり、Pages Router のこのサイトには「段階を踏んで吸収すべき変更」が実質存在しないため。
4. `feature/change-to-app-router` ブランチは壊れており（`layout.tsx` に Pages Router コード混入、`page.tsx` スタブ）、今回の計画はこれに依存しない。App Router 移行を行う場合も作り直しが前提。

## 5. 不明・未検証事項（推測で埋めていない点）

- **next-seo v5 / v7 の Next 16 実動作**: peer 上は衝突しないが、実際に Next 16 + Turbopack でビルド・レンダリングされるかは未検証。ビルド検証ステップで確認する。
- **framer-motion v9 の Next 16（React 18）実動作**: peer は満たすが未検証。特に `AnimatePresence` によるページ遷移 exit アニメーション。
- **next-sitemap v3 の Node 24 / Next 16 実動作**: 未検証。postbuild 実行で確認する。
- **TypeScript 7.0.2（latest）の Next 16 サポート**: 未確認。5.9.3 を採用する前提で計画。
- **Vercel プロジェクト側の設定**（Node バージョン指定、ビルドコマンド上書き、環境変数）: リポジトリからは確認不能。デプロイ前にダッシュボードでの確認が必要。
- **Headless UI v1.7 が React 19 で動作するか**: peer 違反であり保証外。React 19 案を採る場合は v2 移行を必須とする。
- Tailwind 3.2 の `tailwind.config.js` に旧 `purge` キーと `mode: "jit"` が残っている（`tailwind.config.js:3-8`）。Tailwind 3 では警告付きで動くが、`content` への移行が望ましい。今回のスコープ外とするか要判断（Next のアップグレードとは独立）。

## 6. 参照した一次情報

- Next.js upgrade guides: `docs/01-app/02-guides/upgrading/version-14.mdx` / `version-15.mdx` / `version-16.mdx`（vercel/next.js canary、context7 経由）
- React 19 Upgrade Guide: react.dev `blog/2024/04/25/react-19-upgrade-guide`（context7 経由）
- npm registry（2026-07-13 時点の `npm view` 実測）: next@16.2.10 / next-seo@7.2.0 / framer-motion@12.42.2 / @headlessui/react@2.2.10 / next-sitemap@4.2.3 / eslint-config-next@16.2.10 / react@19.2.7 / typescript 5.9.3（5系最新）
