import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import type { InferGetStaticPropsType, NextPage } from "next";
import { client } from "../lib/client";
import type { NewsType } from "./news";
import Date from "src/components/date";

export const getStaticProps = async () => {
  const news = await client.get({
    endpoint: "news",
    queries: { offset: 0, limit: 3 },
  });

  return {
    props: {
      data: news.contents,
    },
  };
};

type Props = {
  data: NewsType[];
};

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  data,
}: Props) => {
  return (
    <>
      <main className="container my-16 max-w-screen-md font-zenkaku font-light">
        <h1 className="w-72 max-w-3/4 mt-20 mx-auto mb-24">
          <Image
            src="/logo.png"
            alt="enFiler"
            width={300}
            height={85}
            priority={true}
            loading={"eager"}
          />
        </h1>
        <section className="section w-full mt-0 text-center profile">
          <figure className="w-40 mt-0 mx-auto mb-8 aspect-square profile__photo">
            <Image
              className="w-full h-full rounded-full shadow-custom01 profile__image"
              src="/oshima-daiki.jpg"
              alt="Daiki Oshima"
              width={150}
              height={150}
              priority={true}
              loading={"eager"}
            />
          </figure>
          <p className="text-main text-lg font-normal tracking-widest profile__name">
            大嶋 大輝
          </p>
          <p className="mb-6 text-accent text-sm font-normal text-opacity-70 tracking-widest">
            Oshima Daiki
          </p>
          <p className="mx-auto max-w-lg mb-8 text-left">
            enFilerという屋号で個人事業主として活動しているWebクリエイターの大嶋大輝です。島根県出雲市を拠点に、Web制作のディレクションやコーディング、運用などWeb制作サービスを幅広く提供しています。
          </p>
        </section>

        <section className="section grid grid-cols-1 sm:grid-cols-5 sm:gap-8">
          <h2 className="heading-h2 col-span-1">お知らせ</h2>
          <ul className="col-span-4 sm:pl-4">
            {data.map((news) => (
              <li key={news.id} className="mb-4 pb-2 border-b border-gray-300">
                <div className="mb-2 align-middle">
                  <span className="text-sm text-gray-500">
                    <Date date={news.publishedAt} />
                  </span>
                </div>
                <Link
                  href={`/news/${news.id}`}
                  className="tracking-wider hover:opacity-40 transition-all duration-300"
                >
                  {news.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="section grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <div>
            <Link
              href="./about"
              className="block p-6 rounded bg-slate-50 shadow-md hover:shadow-xl text-center text-lg tracking-widest text-main hover:tracking-[.25em] transition-all ease-easeInOutBack duration-300"
            >
              About
            </Link>
          </div>
          <div>
            <Link
              href="./service"
              className="block p-6 rounded bg-slate-50 shadow-md hover:shadow-xl text-center text-lg tracking-widest text-main hover:tracking-[.25em] transition-all ease-easeInOutBack duration-300"
            >
              Service
            </Link>
          </div>
          <div>
            <Link
              href="./contact"
              className="block p-6 rounded bg-slate-50 shadow-md hover:shadow-xl text-center text-lg tracking-widest text-main hover:tracking-[.25em] transition-all ease-easeInOutBack duration-300"
            >
              Contact
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
