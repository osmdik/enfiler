import type { Metadata } from "next";
import Link from "next/link";
import { client } from "../../../lib/client";
import type { NewsType } from "../../../types/news";
import Date from "src/components/date";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const data = await client.get({ endpoint: "news" });
  return data.contents.map((content: { id: string }) => ({ id: content.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const news: NewsType = await client.get({ endpoint: "news", contentId: id });
  return { title: news.title };
}

export default async function NewsId({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news: NewsType = await client.get({ endpoint: "news", contentId: id });

  return (
    <main className="container my-16 max-w-screen-md font-zenkaku font-light">
      <div className="mb-12 pt-12 pb-10 border-b border-gray-300">
        <p className="mb-2 text-sm text-gray-500">
          <Date date={news.publishedAt} />
        </p>
        <h1 className="text-xl font-normal tracking-wider">{news.title}</h1>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: `${news.body}`,
        }}
        className="mb-16"
      />
      <Link
        href="/news"
        className="block mx-auto py-4 w-48 max-w-1/2 rounded-full bg-slate-200 text-sm text-gray-500 text-center tracking-widest shadow-md hover:shadow-xl hover:tracking-[.25em] transition-all ease-easeInOutBack duration-300"
      >
        All News
      </Link>
    </main>
  );
}
