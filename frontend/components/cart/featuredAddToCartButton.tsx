"use client";

import { addToCart } from "./addToCart";

export default function AddToCartButton({ productId }: { productId: string }) {
  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    await addToCart(e, productId, 1);
  }

  return (
    <button
      onClick={handleClick}
      className="absolute top-3 right-3 h-10 w-10 hidden rounded-full border-2
      border-green-700 justify-center items-center group-hover:flex
      bg-white backdrop-blur-sm cursor-pointer"
    >
      <p className="text-5xl font-extralight text-green-700">+</p>
    </button>
  );
}
