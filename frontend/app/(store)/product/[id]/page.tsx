export const dynamic = "force-static";

import Image from "next/image";
import QuantitySelector from "./quantitySelector";

export default function ProductPage() {
  const product = {
    name: "Fresh Organic Apples",
    description:
      "Fresh, juicy organic apples sourced directly from local farms. Perfect for snacking, juices, and desserts.",
    price: 299,
    category: "Food Items",
    stock: 12,
    image: "/apples.jpg",
  };

  const reviews = Math.floor(Math.random() * (35 - 15 + 1)) + 15;
  const sold = Math.floor(Math.random() * (60 - (reviews + 1))) + (reviews + 1);

  return (
    <main className="min-h-screen bg-gray-50 py-10 pt-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:flex-row">
        <div className="flex-1 rounded-xl bg-white p-6 shadow">
          <div className="relative aspect-square w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              loading="eager"
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5">
          <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            {product.category}
          </span>

          <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

          <p className="text-3xl font-bold text-green-700 flex items-center justify-start gap-3">
            Rs. {product.price}{" "}
            <span className="text-base text-gray-500 font-normal">
              ⭐ 4.0 ({reviews}) <span className="text-gray-300">|</span> {sold}{" "}
              sold
            </span>
          </p>

          <p className="leading-7 text-gray-600">{product.description}</p>

          <p className="text-sm">
            Availability:{" "}
            <span className="font-semibold text-green-700">
              {product.stock} in stock
            </span>
          </p>

          <QuantitySelector />

          <button className="mt-4 rounded-lg bg-green-700 px-8 py-3 font-semibold text-white transition hover:bg-green-800 cursor-pointer">
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
