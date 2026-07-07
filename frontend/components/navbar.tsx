"use client";
import {
  ProfileFilled,
  ShoppingCartOutlined,
  ShoppingFilled,
  ShoppingOutlined,
  ShoppingTwoTone,
  UserOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 h-14 backdrop-blur-sm bg-white/80 w-full shadow-sm flex items-center justify-between px-5 z-100">
      <Link
        href="/"
        className="h-full w-auto flex items-center justify-center px-10 cursor-pointer"
      >
        <p className="text-2xl font-bold text-black">jhat</p>
        <p className="text-2xl font-bold text-green-700">pat</p>
      </Link>
      <div className="flex gap-5 items-center justify-center h-full w-auto px-5 ">
        <div className="h-4/5 border border-gray-400 overflow-hidden bg-gray-100 flex items-center justify-center gap-2 p-2 rounded-sm cursor-pointer">
          <p className="px-2">Hi Ankit!</p>
        </div>
        <ShoppingCartOutlined className="text-3xl cursor-pointer p-2 transition-all rounded-full hover:bg-gray-100" />
      </div>
    </nav>
  );
}
