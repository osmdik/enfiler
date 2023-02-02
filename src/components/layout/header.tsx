import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const menuFunction = () => {
    setOpenMenu(!openMenu);
  };
  return (
    <header className="sticky top-0 font-zenkaku font-light z-50">
      <div className="container mx-auto max-w-screen-xl flex justify-between py-3 backdrop-blur-sm bg-white/50">
        <Link href="/" className="logo w-40">
          <Image
            src="/logo.png"
            alt="enFiler"
            width={200}
            height={70}
            priority={true}
            loading={"eager"}
          />
        </Link>
        <button onClick={menuFunction}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
      {openMenu ? (
        <div className="fixed top-0 left-0 w-full h-full bg-white">
          <div className="container mx-auto max-w-screen-xl flex justify-between py-3">
            <Link href="/" className="logo w-40" onClick={menuFunction}>
              <Image
                src="/logo.png"
                alt="enFiler"
                width={300}
                height={85}
                priority={true}
                loading={"eager"}
              />
            </Link>
            <button onClick={menuFunction}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex items-center justify-center flex-col pt-20 sm:pt-40">
            <ul className="h-full">
              <li className="mb-8 text-3xl tracking-widest">
                <Link href="/" onClick={menuFunction}>
                  Home
                </Link>
              </li>
              <li className="mb-8 text-3xl tracking-widest">
                <Link href="/about" onClick={menuFunction}>
                  About
                  <span className="ml-4 text-base ">enFilerについて</span>
                </Link>
              </li>
              <li
                className="mb-8 text-3xl tracking-widest"
                onClick={menuFunction}
              >
                <Link href="/service">
                  Service
                  <span className="ml-4 text-base ">サービス案内</span>
                </Link>
              </li>
              <li
                className="mb-8 text-3xl tracking-widest"
                onClick={menuFunction}
              >
                <Link href="/contact">
                  Contact
                  <span className="ml-4 text-base ">お問い合わせ</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : undefined}
    </header>
  );
};

export default Header;
