import type { NextPage } from "next";
import Link from "next/link";
import { NextSeo } from "next-seo";

const Service: NextPage = () => {
  return (
    <>
      <NextSeo title="サービス案内" />
      <main className="container my-16 max-w-screen-md font-zenkaku font-light">
        <div className="mb-12 pt-12 pb-10">
          <h1 className="page-title">サービス案内</h1>
        </div>
        <section className="section">
          <h2 className="heading-h2">主なサービス</h2>
          <div className="mb-8">
            <h3 className="heading-h3">Webサイト制作</h3>
            <p className="leading-8">
              Webサイトの新規制作やリニューアルを承ります。制作一式だけでなく、コーディングのみやディレクションのみ、部分的な改修などのご依頼も承ります。
            </p>
          </div>
          <h3 className="heading-h3">Webサイトの運用・保守管理</h3>
          <div className="mb-8">
            <p className="mb-8 leading-8">
              Webサイトを活用してお客様の事業の課題を解決するために運用のお手伝いをいたします。アクセス解析やWordPressなど定期的に更新が必要なサイトの保守管理など、お客様の運営スタイルに合わせて、ご提案いたします。Webサイトの管理がめんどう、Web担当がいないという方は、ぜひご相談ください。
            </p>
          </div>
        </section>
        <section className="section">
          <h2 className="heading-h2">制作の流れ</h2>
          <div className="mb-8">
            <dl className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-1 font-normal">
                <span className="text-xl leading-4 mr-2">01.</span>
                お問い合わせ
              </dt>
              <dd className="col-span-3">
                <p>
                  メールにてお問い合わせください。お問い合わせの際は、ご依頼の目的やご希望の納期・ご予算、スケジュールなどの情報をいただけるとスムーズにご提案できます。もちろん「よくわからないけど相談したい」というのも歓迎です。
                </p>
              </dd>
            </dl>
            <dl className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-1 font-normal">
                <span className="text-xl leading-4 mr-2">02.</span>
                ヒアリング
              </dt>
              <dd className="col-span-3">
                <p>
                  まずはお客様のお話をお聞かせください。お打ち合わせは基本はオンラインとなりますが、島根県・鳥取県いずれかであれば対面でのお打ち合わせも可能です。
                </p>
              </dd>
            </dl>
            <dl className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-1 font-normal">
                <span className="text-xl leading-4 mr-2">03.</span>
                ご提案・お見積り
              </dt>
              <dd className="col-span-3">
                <p>
                  お客様のご要望や予算に応じて、私にできることを、スケジュールとお見積りとあわせてご提案いたします。
                </p>
              </dd>
            </dl>
            <dl className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-1 font-normal">
                <span className="text-xl leading-4 mr-2">04.</span>
                設計・制作
              </dt>
              <dd className="col-span-3">
                <p>
                  提案させていただいた内容やお客様の要望に合わせてWebサイトの設計を行います。設計した内容をもとにしてデザイン・開発を行います。
                </p>
              </dd>
            </dl>
            <dl className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-1 font-normal">
                <span className="text-xl leading-4 mr-2">05.</span>
                運用
              </dt>
              <dd className="col-span-3">
                <p>
                  Webサイトはつくって終わりではありません。お客様がWebサイトを通して実現したいこと、改善したいことを成し遂げるための運用、またそのお手伝いをさせていただきます。
                </p>
              </dd>
            </dl>
          </div>
        </section>
        <section className="section">
          <h2 className="heading-h2">制作費について</h2>
          <p>
            制作費は、ページ数や仕様、サポート内容によって変動いたしますので目安となります。
            <br />
            また、概算でのお見積りが必要という場合も承りますので、一度お問い合わせいただければと思います。
          </p>
          <div>
            <dl className="grid grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-2 sm:col-span-3 font-normal">
                ランディングページ
              </dt>
              <dd className="col-span-2 sm:col-span-1 text-right">
                100,000円〜
              </dd>
            </dl>
            <dl className="grid grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-2 sm:col-span-3 font-normal">
                コーポレートサイト
                <br />
                （更新機能なし）
              </dt>
              <dd className="col-span-2 sm:col-span-1 text-right">
                100,000円〜
              </dd>
            </dl>
            <dl className="grid grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-2 sm:col-span-3 font-normal">
                コーポレートサイト
                <br />
                （更新機能あり）
              </dt>
              <dd className="col-span-2 sm:col-span-1 text-right">
                200,000円〜
              </dd>
            </dl>
            <dl className="grid grid-cols-4 gap-2 sm:gap-4 py-8 border-b border-gray-300">
              <dt className="col-span-2 sm:col-span-3 font-normal">
                Webサイトの運用
                <br />
                保守管理
              </dt>
              <dd className="col-span-2 sm:col-span-1 text-right">5,000円〜</dd>
            </dl>
          </div>
        </section>
        <section className="section">
          <h2 className="heading-h2">よくあるご質問</h2>
          <div className="mb-8">
            <h3 className="heading-h3">対応エリアについて</h3>
            <p className="leading-8">
              対応エリアは、全国です。
              <br />
              島根・鳥取（岡山・広島・山口の一部地域）は対面でのお打ち合わせも可能です。
              <br />
              その他の地域は、基本的にはオンラインでのコミュニケーションとなります。
            </p>
          </div>
          <div className="mb-8">
            <h3 className="heading-h3">対応時間について</h3>
            <p className="leading-8">
              基本的に、日祝、GW、お盆、年末年始などを除き、作業を行っております。
              <br />
              お打ち合わせについては、下記の日時となりますので、ご相談ください。
              <br />
              <Link
                href="/news/2354138171"
                className="underline tracking-wider hover:opacity-40 hover:no-underline transition-all duration-300"
                scroll={false}
              >
                お打ち合わせの対応時間について
              </Link>
            </p>
          </div>
          <div className="mb-8">
            <h3 className="heading-h3">お支払いについて</h3>
            <p className="leading-8">
              料金のお支払いは完成後の一括払い、もしくは着手時・完成時の2回払いとなります。
              <br />
              お客様の状況によって、分割払いも対応可能ですのでご相談ください。
            </p>
          </div>
          <div className="mb-8">
            <h3 className="heading-h3">特急料金について</h3>
            <p className="leading-8">
              納品までの期間が通常の工期よりも短期間の場合や、GWやお盆、年末年始などの休暇時期での作業が必要な場合は、特急料金として20〜50％の追加料金を頂戴いたします。
              <br />
              その際は、事前に特急料金が発生する旨をご案内いたしますので、ご相談ください。
            </p>
          </div>
          <h3 className="heading-h3">キャンセル料について</h3>
          <div className="mb-8">
            <p className="mb-8 leading-8">
              制作途中でのキャンセルの場合は進行具合によってキャンセル料金が発生します。
              <br />
              例）半分まで制作した段階でキャンセルされた場合はお見積りの50％のキャンセル料金となります
              <br />
              また、当方でサーバーの契約や運用等ランニングコストが発生する制作の場合、制作期間によっては制作途中でも保守管理費が発生いたします。
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Service;
