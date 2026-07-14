# enFiler

島根県出雲市を拠点にホームページ制作を行う Web クリエイター **大嶋大輝（屋号: enFiler）** の事業サイトです。

コンセプト紹介・サービス案内・お知らせ（ブログ）・お問い合わせフォームを備えた、事業サイトとして運用しています。

- 本番サイト: https://en-filer.com

## 技術スタック

| 領域 | 使用技術 |
| --- | --- |
| フレームワーク | [Next.js 16](https://nextjs.org/)（App Router） |
| 言語 | TypeScript 5 / React 19 |
| スタイリング | Tailwind CSS 3 / Sass |
| ヘッドレス CMS | [microCMS](https://microcms.io/)（お知らせ記事） |
| フォーム | React Hook Form + [HyperForm](https://hyperform.jp/) / react-hot-toast |
| アニメーション | Framer Motion |
| アクセス解析 | Google Tag Manager |
| SEO | next-sitemap（サイトマップ / robots.txt 自動生成） |
| フォント | Zen Kaku Gothic New（`next/font`） |

Node.js は `24.x`（`.node-version` に固定）を使用します。

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動（http://localhost:3000）
npm run dev
```

### 環境変数

プロジェクトルートに `.env.local` を作成し、以下を設定します。

| 変数名 | 用途 |
| --- | --- |
| `SERVICE_DOMAIN` | microCMS のサービスドメイン |
| `API_KEY` | microCMS の API キー |
| `NEXT_PUBLIC_HYPERFORM_URL` | お問い合わせフォームの送信先（HyperForm）URL |
| `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID` | Google Tag Manager コンテナ ID |
| `SITE_URL` | サイトマップ生成に使うサイト URL（省略時は `https://en-filer.com`） |

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番ビルド（`postbuild` でサイトマップも生成） |
| `npm run start` | ビルド済みアプリを起動 |
| `npm run lint` | ESLint によるチェック（`src` 配下） |
| `npm run lint:fix` | ESLint による自動修正 |
| `npm run format` | Prettier による整形 |

## ディレクトリ構成

```
src/
├── app/                # App Router のページ・レイアウト
│   ├── layout.tsx      # 共通レイアウト / メタデータ / GTM
│   ├── page.tsx        # トップページ
│   ├── about/          # enFiler について
│   ├── service/        # サービス案内
│   ├── news/           # お知らせ一覧・詳細（[id]）
│   └── contact/        # お問い合わせ
├── components/         # UI コンポーネント（Header / Footer / ContactForm 等）
├── lib/                # microCMS クライアント（server-only）
├── types/              # 型定義
├── styles/             # Sass（グローバルスタイル）
└── utils/              # ユーティリティ（GTM 等）
```

## コンテンツ管理

お知らせ記事は microCMS の `news` エンドポイントから取得しています。記事は静的生成（`force-static`）され、ビルド時に反映されます。
