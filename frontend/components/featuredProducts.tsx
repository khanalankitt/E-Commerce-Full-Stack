import Image from "next/image";
import Link from "next/link";

export default function FeaturedProducts() {
  const featuredProducts = [
    1, 2, 3, 4, 5, 6, 4, 34, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 9,
  ];

  return (
    <section className="h-auto w-full flex items-center justify-center">
      <div className="w-4/5 flex flex-col ">
        <p className="text-3xl pb-10">Featured Products</p>
        <div className="h-auto w-full flex items-center justify-center flex-wrap gap-2 gap-y-3 pb-10">
          {featuredProducts.map((product, index) => (
            <Link
              href="/product/1"
              key={index}
              className="h-auto w-[23%] rounded-t-lg shadow-sm relative group"
            >
              <Image
                src="/logo.png"
                height={200}
                width={300}
                alt="Product Image"
                className="rounded-t-lg object-cover"
              />
              <div className="flex flex-col p-2">
                <p className="line-clamp-1">Lorem ipsum dolor slit</p>
                <p className="text-green-600">
                  Rs.<span className="font-semibold text-lg">445</span>{" "}
                </p>
                <p className="text-gray-500 text-sm">
                  ⭐ 4.0 {"(7)"} <span className="text-gray-300">|</span> 33
                  sold
                </p>
              </div>
              <button
                className="absolute top-3 right-3 h-10 w-10 hidden rounded-full border-2 
              border-green-700 justify-center items-center group-hover:flex p-1 bg-white backdrop-blur-sm cursor-pointer"
              >
                <p className="text-6xl font-extralight text-green-700">+</p>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
