"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        <Image
          src="/logo.png"
          alt="Logo"
          width={70}
          height={70}
          className="mx-auto mb-6"
          priority
        />

        <h1 className="text-3xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-3 text-gray-600">
          We couldn't load this page. Please try again or head back to the
          homepage.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="flex-1 rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 cursor-pointer"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="flex-1 rounded-lg border px-5 py-3 font-medium transition hover:bg-gray-100 cursor-pointer"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
