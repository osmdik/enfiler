# App Router 移行 実装計画（TODO）

作成日: 2026-07-14
対象: enFiler コーポレートサイト
出発点: **第1弾アップグレード完了後**（Next 16 + React 19 + @headlessui/react v2 + framer-motion v12 + next-seo v7 + TypeScript 5.9 / Pages Router）
根拠・裏取り: 同ディレクトリ `KNOWLEDGE.md`

> 本計画は叩き台。実装着手前に下記「意思決定が必要な論点」をユーザーが確定させること。
> 前提の第1弾は現在別担当（Opus）が実装中。バージョンが確定したら数値を再確認する。

---

## 0. 意思決定が必要な論点

### 論点 A: ページ遷移の exit アニメーション実現方式（最大の難所）

現状は `_app.tsx` の `AnimatePresence mode="wait"` + `key={router.asPath}` で **フェードイン＋フェードアウト**。App Router では layout 非再マウント・template は置換であるため exit が素直に焼けない（`KNOWLEDGE.md` §4）。

| | 案 A-1: 入場のみ（exit なし） | 案 A-2: FrozenRouter パターン | 案 A-3: View Transitions API |
| --- | --- | --- | --- |
| 内容 | `app/template.tsx` に `motion.div` の `initial`/`animate` のみ。template 再マウントでフェードイン | `template.tsx`(Client) で `usePathname` を key に `AnimatePresence mode="wait"` + `LayoutRouterContext` を遷移中フリーズさせるラッパーで古いツリー保持 | ブラウザ/Next の View Transitions で遷移。framer-motion を遷移用途では外す |
| 現状再現度 | 中（退場フェードが消える） | 高（enter+exit を忠実再現） | 中〜高（CSS ベースの別表現） |
| Pros | 実装最小・公式挙動のみ・堅牢・将来も壊れない | 見た目を最も維持 | 依存を減らせる・将来の標準 |
| Cons | exit の間だけ体験が変わる | **Next 内部 API 依存（非公式）**。Next 16/React 19 で要 PoC、将来のアップデートで壊れ得る | Next 16 での安定度・ブラウザ対応が未確認。Safari 等の差 |
| 前提 | 退場アニメを妥協できる | 内部 API 依存の保守リスクを許容 | 実験機能を許容 |
| 向いている状況 | まず確実に移行を終えたい | 見た目の完全維持が要件 | 新しい表現に作り替えてよい |
| 確度 | 高（template 再マウントは公式仕様） | 中（非公式・未検証） | 低〜中（未検証） |

**推奨: 案 A-1 で移行を完了させ、必要なら後日 A-2 を PoC。** 根拠: A-2 は内部 API 依存で保守リスクが高く、移行本体のブロッカーにすべきでない。まず A-1 で全ルートを App Router 化し、退場アニメが要件なら別タスクで A-2/A-3 を検証する。

### 論点 B: SSG 維持方式（純 SSG vs ISR）

| | 案 B-1: 純 SSG（`dynamic = 'force-static'`） | 案 B-2: ISR（`revalidate = N`） | 案 B-3: on-demand revalidate（Webhook） |
| --- | --- | --- | --- |
| 内容 | ビルド時に全 news を固定生成（現状と同じ） | 一定間隔で再生成 | microCMS の更新 Webhook で `revalidatePath` |
| Pros | 現状と等価・最も単純・確実 | 再デプロイ不要で記事反映 | 即時反映＋無駄な再生成なし |
| Cons | 記事更新に再デプロイが必要（現状どおり） | 反映にラグ。ビルド設定増 | Webhook/Route Handler の実装・運用増 |
| 前提 | 現運用（更新時デプロイ）を継続 | ラグ許容 | microCMS Webhook 設定可 |
| 確度 | 高 | 高 | 中 |

**推奨: 案 B-1（現状踏襲）。** 移行のスコープを「Router の載せ替え」に限定し、配信モデルは変えない。ISR 化は移行後の独立改善とする。

### 論点 C: 移行の進め方（一括 vs 段階共存）

| | 案 C-1: 一括移行（1 PR で app 全面化） | 案 C-2: ルート単位で段階共存 | 案 C-3: 2フェーズ（先に基盤、次にページ） |
| --- | --- | --- | --- |
| 内容 | `app/` を全ルート作成し `pages/` を削除、同一 PR | `/about` 等から1ルートずつ app へ、pages と共存させながら | フェーズ1: layout/font/GTM/遷移の基盤を app に作り最小1ルート移行。フェーズ2: 残りページを順次 |
| Pros | 共存期間ゼロ。グローバル資産の二重管理なし | 影響範囲を1ルートに限定・レビュー容易 | 難所（基盤・遷移アニメ）を先に潰せる。以降は単純作業 |
| Cons | PR が大きく検証が重い | 移行途中はグローバル遷移アニメ等が二重管理・遷移が不連続 | フェーズ跨ぎの一時的な二重管理 |
| 前提 | 6ルートと小規模 | — | — |
| 向いている状況 | 小規模サイト（本件該当） | 大規模・慎重運用 | バランス重視（本件推奨） |
| 確度 | 高 | 中（共存中の遷移アニメ不連続が uncertain） | 高 |

**推奨: 案 C-3。** 小規模なので基盤（layout/font/GTM/template 遷移）をまず作り、静的ページ1本（`/about`）で疎通確認 → 残りを一気に移す。共存期間を最小化しつつ、難所を先に片付ける。

### 論点 D: Google Fonts の扱い（簡易版）

**推奨**: `next/font/google`（`Zen_Kaku_Gothic_New`, weight 300/400）へ移行し CSS 変数で Tailwind と連携。トレードオフ: 日本語フォントは自己ホストのビルド時ダウンロードが重く表示検証が要る一方、レイアウトシフト削減とプリロード最適化が得られる。ビルド時間や表示に問題が出たら現状の `<link>` を `layout.tsx` の `<head>` に置く方式へ即フォールバック可。異論があれば差し戻してください。

### 論点 E: GTM の扱い（簡易版）

**推奨**: `@next/third-parties/google` の `GoogleTagManager` に置換（script+noscript を一括注入、手書き `gtm.tsx` と `_document` noscript を廃止）。トレードオフ: パッケージ追加が要るが、実装が公式サポートで最小になる。異論があれば差し戻してください。

---

## 1. タスク分解

推奨構成（C-3 フェーズ制 / A-1 / B-1 / D・E 推奨採用）で記述。

### フェーズ 0: 準備・設計確定
- [ ] 第1弾完了ブランチ（Next16/React19 等）を出発点に作業ブランチ作成（例 `feature/app-router-migration`）
- [ ] 論点 A〜E をユーザー確定
- [ ] env 確認（`SERVICE_DOMAIN`/`API_KEY`/`NEXT_PUBLIC_HYPERFORM_URL`/`NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID`）
- [ ] ベースライン取得: Pages Router 版で全6ルートのスクリーンショット＋`<head>` の meta/OGP スナップショット＋遷移アニメの録画

### フェーズ 1: グローバル基盤の構築（app 骨格）
- [ ] **T1-1 root layout 作成**（`src/app/layout.tsx`, Server）
  - [ ] `<html lang="ja">` / `<body>`、`_document` の Google Fonts と GTM noscript を代替
  - [ ] グローバル CSS/scss import（`tailwindcss/tailwind.css` + `src/styles/style.scss`）を layout へ
  - [ ] `metadata`（title.template / default / description / openGraph / twitter / metadataBase / icons）を `_app.tsx` の `DefaultSeo` から移植。OGP 画像の `./` 相対を `metadataBase` 前提の絶対に是正
  - [ ] `viewport` export（現状 `_app` の viewport meta）
- [ ] **T1-2 next/font 導入**（論点 D、採用時）
  - [ ] `Zen_Kaku_Gothic_New`（weight 300/400, display swap, CSS 変数）
  - [ ] `tailwind.config.js` の `fontFamily.zenkaku` を `var(--font-...)` 連携に変更、`<html>` に className/variable 付与
- [ ] **T1-3 GTM 導入**（論点 E、採用時）
  - [ ] `@next/third-parties` 追加、`<GoogleTagManager gtmId={...} />` を layout に配置
  - [ ] 旧 `src/components/gtm.tsx` と `src/utils/gtm.ts` の要否整理（`googleTagManagerId` 定数と `Window.dataLayer` 型は再利用可）
- [ ] **T1-4 Client Providers**（`src/app/providers.tsx`, `"use client"`）
  - [ ] `react-hot-toast` の `<Toaster />` をここに
- [ ] **T1-5 template（遷移アニメ）**（`src/app/template.tsx`, `"use client"`）
  - [ ] 案 A-1: `motion.div` の `initial={{opacity:0}}`/`animate={{opacity:1}}`。`onExitComplete` の `window.scrollTo` は入場時のスクロールリセットに読み替え（`useEffect` で `scrollTo(0,0)`）
  - [ ] （案 A-2 採用時のみ）FrozenRouter ラッパーを別途 PoC
- [ ] **T1-6 共通レイアウト（Header/Footer）**
  - [ ] `src/components/layout/template.tsx`（Header+children+Footer）を app 用に配置。App の `template.tsx` と名前衝突するので **`SiteChrome` 等へリネーム**し layout から使用
  - [ ] `header.tsx` に `"use client"` 付与（headlessui v2）。`footer.tsx` は Server のまま
- [ ] **T1-7 疎通確認用に `/about` を先行移行**（`src/app/about/page.tsx` + `metadata`）、`src/pages/about.tsx` は一旦残す（共存でビルド衝突しないことを確認したら削除）

### フェーズ 2: 残りページ移行
- [ ] **T2-1 静的ページ**: `service` / `contact` を `app/*/page.tsx` 化（`metadata` export）。`contact` は `ContactForm`（`"use client"` 付与）を配置
- [ ] **T2-2 トップ**: `src/app/page.tsx`（async Server）。`client.get({endpoint:"news",queries:{offset:0,limit:3}})` を直接 await。`export const dynamic = 'force-static'`（論点 B-1）
- [ ] **T2-3 news 一覧**: `src/app/news/page.tsx`（async Server）。全件取得。`NewsType` を `src/types/news.ts` 等へ移設し各所の import を更新
- [ ] **T2-4 news 詳細**: `src/app/news/[id]/page.tsx`
  - [ ] `generateStaticParams`（全記事 id）＋ `export const dynamicParams = false`（現状 `fallback:false` 相当）
  - [ ] page 本体で `const { id } = await params` → `client.get({endpoint:"news",contentId:id})`
  - [ ] `generateMetadata` で記事タイトル → `metadata.title`（旧 `NextSeo title={news.title}`）
  - [ ] 本文の `dangerouslySetInnerHTML` はそのまま
- [ ] **T2-5 旧 pages 削除**: `src/pages/` 一式（`_app`/`_document`/各ページ）を削除。`next-seo` を依存から削除。旧 `gtm.tsx` の残骸整理
- [ ] **T2-6 設定の追随**: `next-sitemap.config.js` はそのまま（app ルートを走査）。`tsconfig` の paths（`src/*`）確認

### フェーズ 3: 検証・リリース
- [ ] 下記「3. 検証方法」全項目
- [ ] Vercel Preview で再検証（SSG 生成物・sitemap・GTM・OGP）

---

## 2. 依存関係と順序

```
フェーズ0 準備
  └→ T1-1 layout（土台）
      ├→ T1-2 font ┐
      ├→ T1-3 GTM  ├─ layout に載る。相互独立、並行可
      ├→ T1-4 providers ┘
      └→ T1-6 SiteChrome/header/footer
          └→ T1-5 template（遷移アニメ。header/footer と layout が要る）
              └→ T1-7 /about 先行移行（基盤の疎通確認 = フェーズ2 の前提ゲート）
                  └→ T2-1..T2-4（各ページ。相互独立、並行可）
                      └→ T2-5 旧 pages 削除 + next-seo 削除（全ページ移行後）
                          └→ T2-6 設定確認 → フェーズ3 検証・リリース
```

- **T1-7 のゲート**を通るまでフェーズ2 に進まない（基盤が正しいことを1ルートで確認）
- T2-5（pages 削除）は**全 app ルートが揃ってから**（同一ルート二重定義の衝突回避）
- 案 A-2 FrozenRouter PoC は T1-5 と分離した独立トラック（ブロッカーにしない）

## 3. 検証方法

1. **ビルド**: `npm run build` 成功。**SSG 確認**: `news/[id]` が全記事プリレンダリングされる（ビルドログの Route 一覧で ● Static を確認）。postbuild `next-sitemap` が sitemap/robots 生成
2. **型・lint**: `npx tsc --noEmit` / `npm run lint`
3. **メタ/SEO 検証**（ベースラインと比較）:
   - 各ページの `<title>`（テンプレート適用）、`description`、OGP（`og:image` が絶対 URL に解決）、twitter card
   - `news/[id]` の title が記事タイトルになる
4. **画面確認**（`next start`）— 全6ルート:
   - `/`: ロゴ/プロフィール画像（`next/image`）、news 3件
   - `/news`, `/news/[id]`: 一覧・詳細（本文 HTML、日付）
   - `/about` `/service` `/contact`
   - ヘッダーのハンバーガーメニュー（headlessui v2, Client）
   - **ページ遷移アニメーション**（採用案の挙動: A-1 なら入場フェード、スクロール位置リセット）
   - お問い合わせフォーム（バリデーション onBlur・活性制御・実送信・toast）
   - GTM（dataLayer 初期化・`gtm.js` ロード・noscript）を DevTools で確認
   - Google Fonts（Zen Kaku Gothic New）適用、レイアウトシフト
5. **`API_KEY` 非漏洩確認**: クライアントバンドルに microCMS の API キーが含まれないこと（`lib/client.ts` が Server からのみ import されている）
6. **Vercel Preview**: 上記主要項目を本番相当環境で再確認

## 4. リスク一覧

| # | リスク | 影響 | 発生度 | 緩和策 |
| --- | --- | --- | --- | --- |
| R1 | exit アニメが App Router で再現できない（§4） | 中（体験変化） | 高（設計上の制約） | 案 A-1 を既定に。完全再現要件なら A-2 を別 PoC |
| R2 | FrozenRouter(A-2) が Next16/React19 で動かない | 中 | 中 | ブロッカーにせず A-1 で移行完了。PoC は独立 |
| R3 | `API_KEY` のクライアント漏洩 | 高（機密） | 低 | `lib/client.ts` を Server 限定 import。検証5で確認。必要なら `import 'server-only'` |
| R4 | microCMS SDK fetch が SSG にならず動的化 | 中 | 中 | 各ルートに `dynamic='force-static'` 明示。ビルドログで Static 確認 |
| R5 | next/font 日本語自己ホストでビルド肥大・表示崩れ | 中 | 中 | 論点 D。問題時は `<link>` 方式へフォールバック |
| R6 | OGP 画像の相対パス崩れ（現状 `./ogp-image.jpg`） | 中（SNS 表示） | 中 | `metadataBase` 設定＋絶対解決。検証3で確認 |
| R7 | pages↔app 同一ルート二重定義でビルド衝突 | 高（ビルド不能） | 中 | T2-5 を全移行後に。共存中はルート重複させない |
| R8 | 共存中のグローバル遷移アニメ二重管理・不連続 | 低 | 中 | C-3 で共存期間を最小化 |
| R9 | next-sitemap が app ルートを列挙しない | 低 | 低 | postbuild 出力を検証1で確認 |
| R10 | headlessui v2 の Menu 挙動差（第1弾で移行済み想定） | 低 | 低 | 第1弾で対応済み前提。念のため目視 |
| R11 | 第1弾の確定バージョンが想定とズレる | 中 | 中 | フェーズ0 で実際の package.json を再確認し数値調整 |

## 5. ロールバック方針

- **フェーズ単位の PR 分割**（フェーズ1 基盤 / フェーズ2 ページ移行）。問題時は当該 PR を `git revert`。pages を消すのは最終フェーズなので、途中で戻しても Pages Router 版が生存
- **Vercel Instant Rollback** で本番を直前デプロイへ即時復帰
- **フォールバック設計**: 遷移アニメ→A-1、font→`<link>` 方式、GTM→手書き `next/script` 流用、と各難所に退避経路を用意
- 中間コミットはビルド不能可。push 前の最終コミットで build/lint/`tsc --noEmit` を通す（CLAUDE.md 規約）

## 6. コミット分割方針（CLAUDE.md 準拠）

フェーズ1 PR:
1. `feat: App Router 基盤（root layout / metadata / viewport）を追加`
2. `feat: next/font で Zen Kaku Gothic New を導入し Tailwind と連携`（font 単独）
3. `feat: GTM を @next/third-parties に移行`（GTM 単独）
4. `feat: Client Providers（Toaster）と遷移アニメ template を追加`
5. `refactor: 共通レイアウトを SiteChrome にリネームし header を client 化`（リネームと内容変更は分離: リネームのみのコミット→client化コミット）
6. `feat: /about を App Router へ移行（疎通確認）`

フェーズ2 PR:
7. `feat: service/contact を App Router へ移行`
8. `feat: トップ・news 一覧を Server Component 化（SSG 維持）`
9. `feat: news 詳細を generateStaticParams / generateMetadata へ移行`
10. `refactor: NewsType を types へ移設`（型移設は利用コードと分けるか、小さければ 8/9 に含める）
11. `chore: 旧 pages（_app/_document/各ページ）と next-seo を削除`（削除は独立コミット）

レビュー修正は原則「1指摘1コミット」。

## 7. 見積もり観点

- **フェーズ1（基盤）**: 難所（遷移アニメ設計・font・GTM・layout/metadata 設計）が集中。案 A-1 なら実装 1〜1.5 日 + 検証 0.5 日。A-2 を PoC するなら +0.5〜1 日（不確実性大）
- **フェーズ2（6ルート移行）**: 定型作業。データ取得3ルート＋静的3ルート。実装 1 日 + 検証 0.5 日
- **合計目安**: 2.5〜3.5 日（A-1 採用時）。A-2 追求や font/SSG のトラブルで変動
- 見積もりを狂わせる要因: R1/R2（遷移アニメ）、R4（SSG 化）、R5（日本語 font）、R11（第1弾のズレ）

---

## 人間が決めるために追加で必要な情報

1. **退場（exit）アニメーションは必須要件か**（論点 A の分岐。妥協可なら A-1 で確定・工数最小）
2. **記事の更新反映モデル**（論点 B。現状の「更新時デプロイ」を継続か、ISR/Webhook を導入するか）
3. **Google Fonts と GTM を推奨（next/font / @next/third-parties）で進めてよいか**（論点 D・E）
4. **第1弾完了後の実際の依存バージョン**（フェーズ0 で package.json を確認。想定とズレたら数値調整）
5. **App Router 移行と同時にやりたい改善の有無**（Tailwind config 整理、ISR 化など。スコープに含めるか切り離すか）
