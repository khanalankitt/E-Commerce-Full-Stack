"use client";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useEffect, useState } from "react";

const searchSuggestions = [
  "Search for electronics...",
  "Search for mobile phones...",
  "Search for clothes...",
  "Search for groceries...",
  "Search for laptops...",
];

export default function NavBar() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (searchValue) return; // pause cycling once user is typing
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchSuggestions.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [searchValue]);

  return (
    <nav className="fixed top-0 left-0 h-14 backdrop-blur-sm bg-white/80 w-full shadow-sm flex items-center justify-between px-15 z-100">
      <Link
        href="/"
        className="h-full w-auto flex items-center justify-center px-10 cursor-pointer"
      >
        <p className="text-2xl font-bold text-black">jhat</p>
        <p className="text-2xl font-bold text-green-700">pat</p>
      </Link>

      {/* Search bar */}
      <div className="flex-1 max-w-md mx-5">
        <div className="relative h-10 w-full flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 focus-within:border-green-600 focus-within:bg-white transition-colors">
          <SearchOutlined className="text-gray-500 text-lg mr-2 shrink-0" />
          <div className="relative flex-1 h-full">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full h-full bg-transparent outline-none text-sm relative z-10"
            />
            {/* Animated placeholder — only rendered when input is empty */}
            {!searchValue && (
              <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden z-0">
                <div
                  key={placeholderIndex}
                  className="text-gray-400 text-sm whitespace-nowrap animate-slide-up"
                >
                  {searchSuggestions[placeholderIndex]}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-5 items-center justify-center h-full w-auto px-5">
        {/* User card */}
        <div className="h-4/5 flex items-center gap-2 pl-2 pr-4 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200">
          <div className="h-7 w-7 rounded-full bg-green-700 flex items-center justify-center text-white shrink-0">
            <UserOutlined className="text-sm" />
          </div>
          <p className="text-sm font-medium text-gray-800">Hi, Ankit!</p>
        </div>
        <Link href="/cart">
          <ShoppingCartOutlined className="text-3xl cursor-pointer p-2 transition-all rounded-full hover:bg-gray-100" />
        </Link>
      </div>
    </nav>
  );
}
