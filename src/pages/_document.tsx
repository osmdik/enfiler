import { Html, Head, Main, NextScript } from "next/document";
import { googleTagManagerId } from "../utils/gtm";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@300;400&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}"
                height="0"
                width="0"
                style="display:none;visibility:hidden"
              />`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
