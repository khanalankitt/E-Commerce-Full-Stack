"use client";

import { addToCart } from "./addToCart";

export default function ProductPageAddToCartButton({
  productId,
}: {
  productId: string;
}) {
  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    await addToCart(e, productId);
  }

  return (
    <button
      onClick={handleClick}
      className="mt-4 rounded-lg bg-green-700 px-8 py-3 font-semibold text-white transition hover:bg-green-800 cursor-pointer"
    >
      Add to Cart
    </button>
  );
}
