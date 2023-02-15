import { GetStaticPaths, InferGetStaticPropsType, NextPage } from 'next';
import { client } from '../../lib/client';
import type { NewsType } from '../news';
import Date from 'src/components/date';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await client.get({ endpoint: 'news' });
  const paths = data.contents.map(
    (content: { id: any }) => `/news/${content.id}`
  );
  return { paths, fallback: false };
};

export const getStaticProps = async (context: { params: { id: any } }) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: 'news', contentId: id });

  return {
    props: {
      news: data,
    },
  };
};

type Props = {
  news: NewsType;
};

const NewsId: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  news,
}: Props) => {
  return (
    <>
      <NextSeo title={news.title} />
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
    </>
  );
};

export default NewsId;
