import "tailwindcss/tailwind.css";
import "../styles/style.scss";

import type { AppProps } from "next/app";
import Layout from "../components/layout/template";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import { googleTagManagerId } from "../utils/gtm";
import GoogleTagManager, { GoogleTagManagerId } from "../components/gtm";
import { motion, AnimatePresence } from "framer-motion";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>
      <DefaultSeo
        titleTemplate="%s | 島根県出雲市のホームページ制作 - enFiler | 大嶋大輝"
        defaultTitle="島根県出雲市のホームページ制作 - enFiler | 大嶋大輝"
        description="大嶋 大輝（Oshima Daiki）、屋号enFiler。島根県出雲市を拠点に、Webクリエイターとしてホームページを制作をしています。ホームページ制作のディレクションやコーディング、運用などWeb制作サービスを幅広く提供しています。"
        openGraph={{
          type: "website",
          title: "島根県出雲市のホームページ制作 - enFiler | 大嶋大輝",
          description:
            "大嶋 大輝（Oshima Daiki）、屋号enFiler。島根県出雲市を拠点に、Webクリエイターとしてホームページを制作をしています。ホームページ制作のディレクションやコーディング、運用などWeb制作サービスを幅広く提供しています。",
          site_name: "島根県出雲市のホームページ制作 - enFiler | 大嶋大輝",
          locale: "ja_JP",
          url: "https://en-filer.com/",
          images: [
            {
              url: "./ogp-image.jpg",
              width: 800,
              height: 600,
              alt: "enFiler | 大嶋大輝",
              type: "image/jpeg",
            },
          ],
        }}
        twitter={{
          handle: "@doshimaf",
          cardType: "summary_large_image",
        }}
      />
      <GoogleTagManager
        googleTagManagerId={googleTagManagerId as GoogleTagManagerId}
      />

      <Layout>
        <AnimatePresence
          mode="wait"
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <motion.div
            key={router.asPath}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </Layout>
    </>
  );
}
