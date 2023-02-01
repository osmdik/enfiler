import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';

const Contact: NextPage = () => {
    return (
        <>
            <NextSeo title="お問い合わせ" />
            <main className="container my-16 max-w-screen-md font-zenkaku font-light">
                <div className="mb-12 pt-12 pb-10">
                    <h1 className="page-title">お問い合わせ</h1>
                </div>

                <section className="section">
                    <p className="mb-12 leading-8">
                        enFilerへのご質問やご提案、Web制作に関するご相談やご依頼、お見積りのご依頼をお受けしております。
                        <br />
                        下記のメールアドレスへ、お客様のお名前とあわせてお気軽にご連絡ください。
                        <br />
                        必須ではございませんが、Webサイト制作のご相談の場合、ご依頼の目的やお困りごと、ご予算、納期などの情報もご提供いただけますと幸いです。
                    </p>

                    <Link
                        href="mailto:info@en-filer.com"
                        className="block mx-auto py-4 w-80 max-w-3/4 border border-slate-200 text-main text-center tracking-widest shadow-md hover:shadow-xl hover:tracking-[.25em] transition-all ease-easeInOutBack duration-300"
                    >
                        info@en-filer.com
                    </Link>
                </section>
            </main>
        </>
    );
};

export default Contact;
