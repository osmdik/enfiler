import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container my-16 max-w-screen-md font-zenkaku font-light">
      <div className="mb-12 pt-12 pb-10 text-center">
        <h1 className="page-title">404</h1>
        <p className="mt-6 tracking-wider">
          お探しのページは見つかりませんでした。
        </p>
      </div>
      <Link
        href="/"
        className="block mx-auto py-4 w-48 max-w-1/2 rounded-full bg-slate-200 text-sm text-gray-500 text-center tracking-widest shadow-md hover:shadow-xl hover:tracking-[.25em] transition-all ease-easeInOutBack duration-300"
      >
        Home
      </Link>
    </main>
  );
}
