"use client";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const searchSuggestions = [
  "Search for electronics...",
  "Search for mobile phones...",
  "Search for clothes...",
  "Search for groceries...",
  "Search for laptops...",
];

interface User {
  name: string;
}

export default function NavBar() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchValue) return; // pause cycling once user is typing
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchSuggestions.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [searchValue]);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });

        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to check auth status", error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutConfirm = async (): Promise<boolean> => {
    const result = await Swal.fire({
      title: "You are logging out",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    });

    return result.isConfirmed;
  };

  const handleLogout = async () => {
    const confirmed = await handleLogoutConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      await Swal.fire({
        position: "center",
        icon: "error",
        title: "Logout Failed!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      console.error("Logout failed", error);
      return;
    }

    setUser(null);
    setDropdownOpen(false);
    await Swal.fire({
      position: "center",
      icon: "success",
      title: "Logout Successful!",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    window.location.href = "/";
  };

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
        {authLoading ? (
          <div className="h-4/5 w-28 rounded-full bg-gray-100 animate-pulse" />
        ) : user ? (
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="h-4/5 flex items-center gap-2 pl-2 pr-4 py-2 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
            >
              <div className="h-7 w-7 rounded-full bg-green-700 flex items-center justify-center text-white shrink-0">
                <UserOutlined className="text-sm" />
              </div>
              <p className="text-sm font-medium text-gray-800">
                Hi, {user.name}!
              </p>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-sm shadow-lg overflow-hidden z-50">
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="h-4/5 flex items-center gap-2 pl-2 pr-4 py-2 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
          >
            <div className="h-7 w-7 rounded-full bg-green-700 flex items-center justify-center text-white shrink-0">
              <UserOutlined className="text-sm" />
            </div>
            <p className="text-sm font-medium text-gray-800">Login</p>
          </Link>
        )}

        <Link href="/cart">
          <ShoppingCartOutlined className="text-3xl cursor-pointer p-2 transition-all rounded-full hover:bg-gray-100" />
        </Link>
      </div>
    </nav>
  );
}
