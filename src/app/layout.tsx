import type { Metadata, Viewport } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "tailwindcss/tailwind.css";
import "../styles/style.scss";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { Providers } from "./providers";
import { googleTagManagerId } from "../utils/gtm";

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["300", "400"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-zen-kaku",
});

const description =
  "大嶋 大輝（Oshima Daiki）、屋号enFiler。島根県出雲市を拠点に、Webクリエイターとしてホームページを制作をしています。ホームページ制作のディレクションやコーディング、運用などWeb制作サービスを幅広く提供しています。";
const siteName = "島根県出雲市のホームページ制作 - enFiler | 大嶋大輝";

export const metadata: Metadata = {
  metadataBase: new URL("https://en-filer.com"),
  title: {
    template: `%s | ${siteName}`,
    default: siteName,
  },
  description,
  openGraph: {
    type: "website",
    title: siteName,
    description,
    siteName,
    locale: "ja_JP",
    url: "https://en-filer.com/",
    images: [
      {
        url: "/ogp-image.jpg",
        width: 800,
        height: 600,
        alt: "enFiler | 大嶋大輝",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={zenKaku.variable}>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
      <GoogleTagManager gtmId={googleTagManagerId} />
    </html>
  );
}
