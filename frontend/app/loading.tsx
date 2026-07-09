import Image from "next/image";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={80}
          height={80}
          priority
          className="mx-auto animate-pulse"
        />

        <div className="mt-8 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        </div>

        <h2 className="mt-6 text-xl font-semibold text-gray-900">
          Loading...
        </h2>

        <p className="mt-2 text-gray-500">
          Please wait while we prepare your shopping experience.
        </p>
      </div>
    </main>
  );
}