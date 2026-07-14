import type { Metadata } from "next";
import { ContactForm } from "src/components/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
};

export default function Contact() {
  return (
    <main className="container my-16 max-w-screen-md font-zenkaku font-light">
      <div className="mb-12 pt-12 pb-10">
        <h1 className="page-title">お問い合わせ</h1>
      </div>

      <section className="section">
        <p className="mb-12 leading-8">
          enFilerへのご質問やご提案、Web制作に関するご相談やご依頼、お見積りのご依頼をお受けしております。
          <br />
          以下のお問い合わせフォームから、お気軽にご連絡ください。
          <br />
          またホームページ制作のご相談の場合、ご依頼の目的やお困りごと、ご予算、納期などの情報もご提供いただけますと幸いです。
        </p>
        <ContactForm />
      </section>
    </main>
  );
}
