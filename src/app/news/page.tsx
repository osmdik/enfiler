import type { Metadata } from "next";
import Link from "next/link";
import { client } from "../../lib/client";
import type { NewsType } from "../../types/news";
import Date from "src/components/date";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "お知らせ",
};

export default async function News() {
  const news = await client.get({
    endpoint: "news",
  });
  const data: NewsType[] = news.contents;

  return (
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
  );
}
