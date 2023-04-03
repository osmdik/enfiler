import type { NextPage } from "next";
import { NextSeo } from "next-seo";

const About: NextPage = () => {
  return (
    <>
      <NextSeo title="enFilerについて" />
      <main className="container my-16 max-w-screen-md font-zenkaku font-light">
        <div className="mb-12 pt-12 pb-10">
          <h1 className="page-title">enFilerについて</h1>
        </div>

        <section className="section">
          <h2 className="heading-h2 ">コンセプト</h2>
          <p className="mb-2 leading-8">
            enFilerとは、フランス語で「ともに」を意味する
            <ruby>
              Ensemble
              <rp>（</rp>
              <rt>アンサンブル</rt>
              <rp>）</rp>
            </ruby>
            と、「紡ぐ」を意味する
            <ruby>
              Filer
              <rp>（</rp>
              <rt>フィレール</rt>
              <rp>）</rp>
            </ruby>
            を組み合わせた造語です。アンフィレールと読みます。
          </p>
          <p className="mb-2 leading-8">
            Web制作を通して、お客様の夢やそこに込められた思いをともに紡いでいく。
            <br />
            そんな思いを胸に、お客様の会社や新規事業、既存事業をより前へ進めるWeb制作を目指します。
          </p>
        </section>

        <section className="section">
          <h2 className="heading-h2 ">事業概要</h2>
          <div>
            <dl className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-1 font-normal">屋号</dt>
              <dd className="col-span-3">enFiler（アンフィレール）</dd>
            </dl>
            <dl className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-1 font-normal">代表</dt>
              <dd className="col-span-3">大嶋 大輝（Daiki Oshima）</dd>
            </dl>
            <dl className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-1 font-normal">拠点</dt>
              <dd className="col-span-3">
                <p>島根県出雲市</p>
                <p className="text-sm">※対応エリアは全国です。</p>
              </dd>
            </dl>
            <dl className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-1 font-normal">開業日</dt>
              <dd className="col-span-3">2022年 7月</dd>
            </dl>
            <dl className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-1 font-normal">対応時間</dt>
              <dd className="col-span-3">
                <p>平日</p>
                <p className="text-sm">
                  8:00〜19:00（オンラインまたはお電話のみ）
                </p>
                <p className="mt-2">土曜日</p>
                <p className="text-sm">9:00〜17:00（対面）</p>
                <p className="text-sm">8:00〜19:00（オンラインまたはお電話）</p>
              </dd>
            </dl>
            <dl className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-1 font-normal">事業内容</dt>
              <dd className="col-span-3">
                <ul>
                  <li>コーディング</li>
                  <li>ディレクション業務</li>
                  <li>WordPressを利用したWebサイト開発</li>
                  <li>JamstackによるWebサイト制作</li>
                  <li>Webサイトの保守管理・運用</li>
                  <li>アナリティクスなどのアクセス解析</li>
                </ul>
              </dd>
            </dl>
            <dl className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-1 font-normal">主要取引先</dt>
              <dd className="col-span-3">
                <ul>
                  <li>株式会社Saphan</li>
                  <li>Blue株式会社</li>
                </ul>
              </dd>
            </dl>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
