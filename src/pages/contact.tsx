import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import { ContactForm } from "src/components/ContactForm";

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
            必須ではございませんが、ホームページ制作のご相談の場合、ご依頼の目的やお困りごと、ご予算、納期などの情報もご提供いただけますと幸いです。
          </p>
          <ContactForm />
        </section>
      </main>
    </>
  );
};

export default Contact;
