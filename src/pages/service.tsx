import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';

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
                                <span className="text-xl leading-4 mr-2">
                                    01.
                                </span>
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
                                <span className="text-xl leading-4 mr-2">
                                    02.
                                </span>
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
                                <span className="text-xl leading-4 mr-2">
                                    03.
                                </span>
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
                                <span className="text-xl leading-4 mr-2">
                                    04.
                                </span>
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
                                <span className="text-xl leading-4 mr-2">
                                    05.
                                </span>
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
                            <dd className="col-span-2 sm:col-span-1 text-right">
                                5,000円〜
                            </dd>
                        </dl>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Service;
