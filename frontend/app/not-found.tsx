import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        <Image
          src="/logo.png"
          alt="Logo"
          width={70}
          height={70}
          priority
          className="mx-auto mb-6"
        />

        <h1 className="text-5xl font-bold text-gray-900">404</h1>

        <h2 className="mt-3 text-2xl font-semibold text-gray-900">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-600">
          Sorry, the page you're looking for doesn't exist or may have been
          moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
        >
          Back to Homepage
        </Link>
      </div>
    </main>
  );
}