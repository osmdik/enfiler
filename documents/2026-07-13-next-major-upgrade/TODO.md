# Next.js メジャーアップグレード 実装計画（TODO）

作成日: 2026-07-13
対象: enFiler コーポレートサイト（`main` / Next 13.0.7 / Pages Router / SSG）
目標: Next 16 系（`next@16.2.10`）
根拠・調査結果: 同ディレクトリの `KNOWLEDGE.md` を参照

> 本計画は叩き台。以下の「意思決定が必要な論点」をユーザーが確定させてから実装に着手すること。

---

## 0. 意思決定が必要な論点（実装前にユーザー確定）

### 論点 A: 段階的アップグレード vs 一気に 16

| | 案 A-1: 一気に 13→16 | 案 A-2: 2段階（13→15 → 15→16） | 案 A-3: 1メジャーずつ（13→14→15→16） |
| --- | --- | --- | --- |
| 内容 | `next@16.2.10` へ直接更新し、1つの PR で完結 | まず 15 系最新で安定させ、別 PR で 16 へ | 各メジャーで install → build → 動作確認を繰り返す |
| Pros | 作業・検証が1回。audit 指摘の解消が最速 | 問題発生時に「15 までは OK」と切り分け可能。Turbopack 化（16）を分離できる | 問題の切り分けが最も細かい |
| Cons | ビルドが通らない場合、原因メジャーの特定に手間 | PR が2本になり検証も2回 | 4回の検証は本サイト規模には過剰。中間バージョンを踏む意味が薄い |
| 前提 | 破壊的変更の該当箇所が少ないこと（調査済み: ほぼ該当なし） | — | — |
| 向いている状況 | 小規模・Pages Router・SSG のみの本サイト | 慎重に進めたい場合 | 大規模アプリや App Router 利用時 |
| 確度 | 高（13→16 の breaking changes を全数照合し、該当が「TS 5 必須」程度と確認済み） | 高 | 高（ただし工数対効果は低） |

**推奨: 案 A-1**。根拠: 14/15 の主要な破壊的変更（async request APIs、fetch キャッシュ既定変更、`@next/font` 削除）はすべて App Router 向けか本リポジトリ未使用機能であり、段階を踏んで吸収すべき差分が実質存在しない（`KNOWLEDGE.md` §1・§4）。ビルド不能時のフォールバックとして案 A-2 へ切替可能。

### 論点 B: Pages Router 維持 vs App Router 移行を同時実施

| | 案 B-1: Pages Router 維持で Next 16 化 | 案 B-2: App Router 移行も同時実施 | 案 B-3: Next 16 化を先行、App Router 移行は後続の独立プロジェクト |
| --- | --- | --- | --- |
| 内容 | `src/pages/` 構成のまま依存だけ更新 | ルーティング・SEO・データ取得を App Router 流に書き直す | 今回は B-1 と同じ。App Router は別途 `/discover`〜`/plan` を回して計画 |
| Pros | 変更最小・レビュー容易・ロールバック容易 | 将来の Next 主流構成に一度で追いつく。Metadata API 等の恩恵 | リスク分離。16 化の成果（脆弱性解消）を先に得られる |
| Cons | App Router 移行の宿題が残る | スコープ膨張。next-seo→Metadata API、`getStaticProps`→Server Component、`AnimatePresence` によるページ遷移アニメーションの再設計（App Router では exit アニメーションの実現が難しい）が必要。React 19 必須化 | 二度手間感（依存更新を2回触る可能性） |
| 前提 | Next 16 でも Pages Router がサポート継続（公式 docs で確認済み。削除予告は未確認） | 全ページの書き直しと十分な検証時間 | — |
| 向いている状況 | まず脆弱性・EOL 解消を急ぐ場合 | サイト改修をまとめて行いたい場合 | 本件（audit 起点のアップグレード） |
| 確度 | 高 | 中（App Router でのページ遷移アニメーション再現性が未検証） | 高 |

**推奨: 案 B-3（実作業は B-1 と同一）**。`feature/change-to-app-router` ブランチは壊れており（`layout.tsx` に `_document`/`_app` 混入、`page.tsx` スタブ）今回は依存しない。ブランチは参考資料として残置し、App Router 移行プロジェクト開始時に「参照のみ・作り直し」とすることを推奨（削除するかは別途ユーザー判断）。

### 論点 C: React 18 維持 vs React 19 へ移行

| | 案 C-1: React 18.2 維持 | 案 C-2: React 19 へ同時移行 | 案 C-3: React 19 移行を第2弾 PR に分離 |
| --- | --- | --- | --- |
| 内容 | `next@16` + `react@18.2.0` のまま（peer は `^18.2.0 \|\| ^19` で成立） | react/react-dom/@types を 19 系へ。**連鎖して @headlessui/react v2・framer-motion v12 へのメジャーアップが必須** | 第1弾: Next 16 + React 18。第2弾: React 19 + headlessui v2 + framer-motion v12 + next-seo v7 等 |
| Pros | 変更範囲最小。headlessui/framer-motion を触らない | 依存を一気に最新化。App Router 移行の前提が整う | 各 PR の diff が小さく、問題発生時に原因が Next 側か React 側か即断できる |
| Cons | React 18 対応がいつまで続くか不透明（Next 16 peer では OK、17 以降は不明） | ヘッダーメニュー（headlessui v1→v2 の API 破壊的変更）とページ遷移アニメーション（framer-motion v9→v12）の書き換え・検証が同一 PR に混ざる | PR 2本分の検証コスト |
| 前提 | — | `src/components/layout/header.tsx` の書き換え工数を許容 | — |
| 向いている状況 | 最短で audit 解消したい | 更新を1回で済ませたい | 安全性とレビュー性を優先する場合 |
| 確度 | 高（next@16.2.10 の peerDependencies を npm registry で実測確認） | 中（headlessui v2 / framer-motion v12 での見た目・挙動の同一性は未検証） | 高 |

**推奨: 案 C-3**。React 19 自体はアプリコードの書き換えほぼ不要（`KNOWLEDGE.md` §1）だが、headlessui v1 が React 19 の peer 範囲外である点がボトルネック。分離すれば第1弾のリスクがほぼゼロになる。

### 論点 D: ESLint まわりの扱い（軽微・簡易版）

現状 `.eslintrc.json` は `eslint-config-next` を extends しておらず実質未使用。Next 16 の `eslint-config-next` は ESLint 9（flat config）必須。
**推奨**: 第1弾では `eslint-config-next` を依存から削除するだけに留め、ESLint 9 / flat config 化は別タスクとする（アップグレード PR に lint 基盤刷新を混ぜない）。異論があれば差し戻してください。

---

## 1. タスク分解（3パターン）

採用パターンは論点 A〜C の決定に依存する。**推奨は「パターン 1 → パターン 2」の2段構成**（= A-1 + B-3 + C-3）。

### パターン 1: 最小リスク版「Next 16 化のみ（React 18 維持）」 ← 第1弾推奨

- [ ] **P1-0 準備**
  - [ ] `main` から作業ブランチ作成（例: `chore/next-16-upgrade`）
  - [ ] ローカル環境変数の確認（`SERVICE_DOMAIN` / `API_KEY` / `NEXT_PUBLIC_HYPERFORM_URL` / `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID` が `.env.local` にあること。microCMS 疎通がないとビルド不可）
  - [ ] 現状のベースライン記録: `npm run build` が Next 13 で通ることと、全ページ（`/` `/about` `/service` `/contact` `/news` `/news/[id]`）のスクリーンショット取得
- [ ] **P1-1 未使用依存の削除**（独立コミット）
  - [ ] `@next/font` を dependencies から削除（import 0 件確認済み）
  - [ ] `vivus` / `@types/vivus` を削除（import 0 件確認済み）
  - [ ] `eslint-config-next` を削除（`.eslintrc.json` で未参照。論点 D の決定に従う）
  - [ ] 検証: `npm install` → `npm run build` → `npm run lint`
- [ ] **P1-2 コア依存の更新**（独立コミット）
  - [ ] `next: 16.2.10`
  - [ ] `typescript: 5.9.3`（※ latest の 7.x は採用しない。理由は KNOWLEDGE.md §5）
  - [ ] `@types/node: ^24`（Node 24.x に整合）
  - [ ] `@types/react` / `@types/react-dom` を 18 系最新へ（React 18 維持のため 19 系にしない）
  - [ ] `eslint` は 8 系のまま据え置き（論点 D）
- [ ] **P1-3 ビルドと自動修正の取り込み**
  - [ ] `npm run build` 実行。Next 16 が `tsconfig.json` / `next-env.d.ts` に自動修正を提案・適用した場合はそのまま取り込む
  - [ ] TypeScript 5.9 での型エラーを修正（現状コードは `strict: true` で通っているため軽微と予想。`src/components/date.tsx:8` の `any` 引数などは既存動作を変えない範囲で対応）
  - [ ] Turbopack ビルドが失敗する場合: エラー内容を記録した上で `build: "next build --webpack"` に暫定退避し、原因を別タスク化（勝手に大きな構成変更をしない）
- [ ] **P1-4 動作検証**（下記「3. 検証方法」を全項目実施）
- [ ] **P1-5 リリース**
  - [ ] PR 作成 → Vercel の Preview デプロイで再検証（特に microCMS ビルド・sitemap 生成・GTM）
  - [ ] Vercel プロジェクト設定の確認（Node バージョン・ビルドコマンド。リポジトリから確認不能のためダッシュボードで要確認）
  - [ ] マージ → 本番デプロイ → 本番 URL で smoke test

### パターン 2: React 19 + 周辺依存メジャー更新（第2弾。パターン 1 完了後）

- [ ] **P2-1 React 19 化**（1コミット）
  - [ ] `react` / `react-dom` を 19.2 系へ、`@types/react` / `@types/react-dom` を 19 系へ
  - [ ] ビルド・型エラー対応（アプリコードは propTypes/defaultProps/レガシー Context 等の削除対象 API を未使用と確認済み）
- [ ] **P2-2 @headlessui/react v1.7 → v2.2**（1コミット）
  - [ ] `src/components/layout/header.tsx` の `Menu.Button` → `MenuButton`、`Menu.Items` → `MenuItems`、`Menu.Item` → `MenuItem` 等へ書き換え（v2 移行ガイドに従う。`Transition` の扱いも v2 流に）
  - [ ] 検証: ハンバーガーメニューの開閉・遷移・フォーカスリング・アニメーション
- [ ] **P2-3 framer-motion v9 → v12**（1コミット）
  - [ ] パッケージ更新（v12 は `framer-motion` 名のままでも提供。`motion` への改名採用は任意）
  - [ ] `src/pages/_app.tsx` の `AnimatePresence mode="wait"` + exit アニメーションの動作検証。挙動差があれば修正
- [ ] **P2-4 残りの依存更新**（1コミット、任意）
  - [ ] `next-seo` 5.15 → 7.2（`_app.tsx` の `DefaultSeo` / 各ページ `NextSeo` の props 互換を確認）
  - [ ] `next-sitemap` 3 → 4（config 形式はほぼ互換。postbuild で生成物 diff 確認）
  - [ ] `microcms-js-sdk` 2 → 3、`react-hot-toast` 2.6、`@hookform/resolvers` / `react-hook-form` 最新
- [ ] **P2-5 検証・リリース**（パターン 1 と同じ手順）

### パターン 3: 一括最新化（非推奨の比較用）

Next 16 + React 19 + 全依存メジャー更新 + ESLint 9 化を1 PR で実施。
- Pros: 作業1回。 / Cons: diff が大きく、表示崩れ・挙動差の原因特定が困難。ロールバックが全戻しになる。
- 採用する場合もコミットは P1-1 → P1-2/3 → P2-1 → P2-2 → P2-3 → P2-4 の順に積み、コミット単位で bisect 可能にすること。

---

## 2. 依存関係と順序

```
P1-0 準備（env・ベースライン）
  └→ P1-1 未使用依存削除          … 他と独立。最初にやると以降の diff が綺麗
      └→ P1-2 next/TS 等更新      … P1-1 の後（@next/font が残ると 16 系と競合しうる）
          └→ P1-3 ビルド・自動修正 … P1-2 直後
              └→ P1-4 検証 → P1-5 リリース
                  └→（ユーザー判断）→ P2-1 React 19 → P2-2 headlessui → P2-3 framer-motion → P2-4 その他 → P2-5
```

- P2-2 と P2-3 は P2-1（React 19）に依存（peer dependency 上、React 19 では現行バージョンが範囲外のため）
- P2-4 は独立性が高く、順序入替・省略可
- ESLint 9 / flat config 化・Tailwind config 整理（`purge`→`content`）は本計画のスコープ外の独立タスク

## 3. 検証方法（各リリース前に全項目）

1. **ビルド**: `npm run build` 成功（SSG: 静的 5 ページ + `/news/[id]` の全記事生成）。postbuild の `next-sitemap` が `public/` 相当の出力に `sitemap.xml` / `robots.txt` を生成すること
2. **型・lint**: `npx tsc --noEmit` / `npm run lint`
3. **画面確認**（`npm run dev` と `next start` の両方が望ましい。最低限 `next start`）:
   - `/` : ロゴ・プロフィール画像（`next/image`）、microCMS お知らせ 3 件表示
   - `/news` `/news/[id]` : 記事一覧・詳細（`dangerouslySetInnerHTML` の本文レンダリング、日付フォーマット）
   - `/about` `/service` `/contact` : 静的コンテンツ
   - ヘッダーのハンバーガーメニュー開閉（headlessui）
   - ページ遷移時のフェードアニメーション（framer-motion の exit を含む）と遷移後のスクロール位置リセット
   - お問い合わせフォーム: バリデーション（onBlur）、送信ボタンの活性制御、（可能なら）Hyperform への実送信 + toast 表示
   - GTM: dataLayer 初期化と `gtm.js` ロード（DevTools の Network で確認）
   - Google Fonts（Zen Kaku Gothic New）の適用
4. **ビルド出力の差分確認**: Next 13 時代のベースラインとスクリーンショット比較（特に Turbopack 化による CSS/scss の差）
5. **Vercel Preview**: PR デプロイで 1〜4 の主要項目を再確認

## 4. リスク一覧

| # | リスク | 影響 | 発生度 | 緩和策 |
| --- | --- | --- | --- | --- |
| R1 | Turbopack ビルド（16 でデフォルト）で scss/tailwind の出力差・ビルド失敗 | 中 | 低（カスタム webpack 設定なし・`~` import なしを確認済み） | `next build --webpack` へ退避可（16 時点では webpack 併存） |
| R2 | framer-motion v9 が Next 16 / React 18 で動作しない・遷移アニメーション劣化 | 中 | 低〜中（peer は満たすが実動作未検証） | P1-4 で目視検証。NG なら v12 更新を第1弾に前倒し |
| R3 | next-seo v5 が Next 16 で meta 出力されない | 中（SEO 影響） | 低（peer 衝突なし、未検証） | ビルド後 HTML の `<head>` を目視確認。NG なら v7 へ |
| R4 | headlessui v1→v2 でメニューの挙動・見た目変化（第2弾） | 中 | 中 | v2 移行ガイド準拠 + 目視検証。第2弾に分離済み |
| R5 | TypeScript 4.9→5.9 での新規型エラー | 低 | 中 | `strict: true` で現状通過しており軽微と予想。個別修正 |
| R6 | microCMS API 不通でビルド失敗（env 未設定） | 高（ビルド不能） | 低 | P1-0 で env 確認を必須化 |
| R7 | Vercel 側設定（Node/ビルドコマンド）との不整合 | 中 | 不明（ダッシュボード未確認） | Preview デプロイで検出。リリース前にダッシュボード確認 |
| R8 | next-sitemap v3 が Node 24 / Next 16 で失敗 | 低 | 不明 | postbuild 実行で確認。NG なら v4 へ |
| R9 | ブラウザ要件の引き上げ（Safari 16.4+ 等）による閲覧者影響 | 低 | 低 | ユーザーに事前共有（コーポレートサイトの閲覧層次第） |

## 5. ロールバック方針

- **PR 単位**: 第1弾・第2弾を別 PR にすることで、`git revert`（マージコミットの revert）だけで前状態へ戻せる。lockfile も同一コミットに含めるため revert で整合が取れる
- **Vercel**: 本番で問題発覚時は Vercel ダッシュボードの Instant Rollback で直前の正常デプロイへ即時復帰（コード修正を待たずに復旧可能）
- **ビルド手段のフォールバック**: Turbopack 起因の問題は `--webpack` フラグで暫定回避（恒久対応は別タスク化）
- 中間コミットはビルド不能でも許容するが、**push 前の最終コミットで build / lint / `tsc --noEmit` を通す**（CLAUDE.md 規約）

## 6. コミット分割方針（CLAUDE.md 準拠）

第1弾 PR（パターン 1）:
1. `chore: 未使用依存を削除（@next/font, vivus, eslint-config-next）` — 削除のみ。機能コードと分離（依存関係の更新 ↔ 機能コードの分離規約）
2. `chore: Next.js 16 / TypeScript 5.9 へ更新` — package.json + lockfile + Next が自動適用した tsconfig/next-env の変更を含める（1実装1コミット）
3. `fix: アップグレードに伴う型エラー等の修正` — 2 で修正が必要になった場合のみ。軽微なら 2 に含めてよい

第2弾 PR（パターン 2）: P2-1〜P2-4 をそれぞれ 1 コミット（React 19 化 / headlessui v2 / framer-motion v12 / その他依存）。レビュー修正は「1指摘1コミット」。

## 7. 見積もり観点

- **第1弾（パターン 1）**: 変更ファイルは package.json / lockfile / tsconfig 程度で、コード変更は型エラー修正のみの見込み。作業の大半は検証（全 6 ルートの画面確認・フォーム実送信・Preview 確認）。目安: 実装 0.5 日 + 検証 0.5 日
- **第2弾（パターン 2）**: `header.tsx`（headlessui v2 書き換え）と `_app.tsx`（framer-motion 検証）が中心。目安: 実装 0.5〜1 日 + 検証 0.5 日
- 見積もりを狂わせうる要因: R2/R3（未検証の実動作）、R7（Vercel 設定）、Turbopack での想定外のビルド差

---

## 人間が決めるために追加で必要な情報

1. **閲覧者のブラウザ要件**: Next 16 のブラウザ要件（Safari 16.4+ / Chrome 111+ 等）を許容できるか（アクセス解析で古いブラウザ比率を確認できると確実）
2. **App Router 移行の意向とタイミング**: 論点 B の判断材料。近い将来やるなら第2弾（React 19）を先に済ませる価値が上がる
3. **`feature/change-to-app-router` ブランチの扱い**: 残置 / 削除 / 参照用タグ化のいずれにするか
4. **Vercel ダッシュボードの現設定**（Node バージョン・ビルドコマンド・環境変数）: リポジトリから確認できないため
5. **ESLint 9 / flat config 化と Tailwind config 整理を別タスクとして起票するか**（論点 D・KNOWLEDGE.md §5）
