"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Props {
  item: MenuItem;
}

export interface MenuItem {
  title: string;
  route?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

export default function Dropdown(props: Props) {
  const { item } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuItems = item?.children ? item.children : [];

  const toggle = () => {
    setIsOpen((old) => !old);
  };

  const transClass = isOpen ? "flex" : "hidden";

  return (
    <>
      <div className="relative flex items-center gap-1">
        <button
          className="text-16-semibold hover:text-green-500"
          onClick={toggle}
        >
          {item.title}
        </button>
        <button onClick={toggle}>
          {isOpen ? (
            <Image
              src="/assets/icons/up-arrow.svg"
              alt="up-arrow"
              width={16}
              height={16}
            />
          ) : (
            <Image
              src="/assets/icons/down-arrow.svg"
              alt="down-arrow"
              width={16}
              height={16}
            />
          )}
        </button>

        <div
          className={`absolute top-8 right-4 z-30 w-[250px] flex flex-col py-4 bg-dark-400 rounded-md ${transClass}`}
        >
          {menuItems.map((item) => (
            <Link
              key={item.route}
              className="hover:bg-green-500 hover:text-dark-300 px-4 py-1 text-16-semibold flex justify-between items-center"
              href={item?.route || ""}
              onClick={toggle}
            >
              {item.title}
              {item.icon && item.icon}
            </Link>
          ))}
        </div>
      </div>
      {isOpen ? (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-20 bg-black/40"
          onClick={toggle}
        ></div>
      ) : (
        <></>
      )}
    </>
  );
}
