import type { InferGetStaticPropsType, NextPage } from "next";
import Link from "next/link";
import { client } from "../lib/client";
import Date from "src/components/date";
import { NextSeo } from "next-seo";

export type NewsType = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

type Props = {
  data: NewsType[];
};

export const getStaticProps = async () => {
  const news = await client.get({
    endpoint: "news",
  });

  return {
    props: {
      data: news.contents,
    },
  };
};

const News: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  data,
}: Props) => {
  return (
    <>
      <NextSeo title="お知らせ" />
      <main className="container my-16 max-w-screen-md font-zenkaku font-light">
        <div className="mb-12 pt-12 pb-10">
          <h1 className="page-title">All News</h1>
        </div>

        <ul className="">
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
      </main>
    </>
  );
};

export default News;
