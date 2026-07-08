export default function Footer() {
  return (
    <footer className="w-full bg-green-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-5 py-10 flex  items-center justify-center gap-4">
        <p className="text-sm text-gray-200">
          © {new Date().getFullYear()} JhatPat. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
