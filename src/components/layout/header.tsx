import Link from "next/link";
import Image from "next/image";
import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bars2Icon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", subname: "", href: "/" },
  { name: "About", subname: "enFilerについて", href: "/about" },
  { name: "Service", subname: "サービス案内", href: "/service" },
  { name: "Contact", subname: "お問い合わせ", href: "/contact" },
];

const Header = () => {
  return (
    <header className="sticky top-0 font-zenkaku font-light z-10">
      <div className="container mx-auto max-w-screen-xl flex justify-between py-3 backdrop-blur-sm bg-white/50">
        <Link href="/" className="logo w-40 flex items-center" scroll={false}>
          <Image
            src="/logo.png"
            alt="enFiler"
            width={200}
            height={70}
            priority={true}
            loading={"eager"}
          />
        </Link>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex flex-col justify-center items-center w-full rounded-md bg-opacity-20 p-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <span className="sr-only">Open menu</span>
            <Bars2Icon
              className="h-10 w-10 text-slate-600"
              aria-hidden="true"
            />
            <span className="block -translate-y-1.5 text-xs text-center">
              MENU
            </span>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              as="ul"
              className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg focus:outline-none"
            >
              {navigation.map((item) => (
                <li
                  key={item.name}
                  className="text-center text-lg tracking-widest"
                >
                  <Menu.Item>
                    <Link
                      href={item.href}
                      scroll={false}
                      className="inline-block w-full py-4 hover:opacity-40 hover:tracking-[.25em] transition-all ease-easeInOutBack duration-300"
                    >
                      {item.name}
                      <span className="block text-xs">{item.subname}</span>
                    </Link>
                  </Menu.Item>
                </li>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
