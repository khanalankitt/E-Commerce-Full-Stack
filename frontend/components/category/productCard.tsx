"use client";
import { memo } from "react";
import { ShoppingCartOutlined, StarFilled } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/app/types/product";
import { addToCart } from "../addToCart";

function ProductCard({ product }: { product: IProduct }) {
  return (
    <Link
      href={`/product/${product._id}`}
      className="group bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
    >
      <div className="relative bg-gray-100">
        <Image
          src={product.image}
          height={100}
          width={100}
          alt={product.name}
          className="w-full aspect-square object-contain p-2 rounded-t-2xl"
        />
      </div>

      <div className="p-4">
        <div className="flex text-yellow-500 text-xs mb-2">
          {Array.from({ length: product.rating }).map((_, i) => (
            <StarFilled key={i} />
          ))}
        </div>
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-green-700 text-sm font-bold mt-2">
          Rs. <span className="text-lg"> {product.price}</span>
        </p>
        <button
          onClick={(e) => addToCart(e, product._id, 1)}
          className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <ShoppingCartOutlined />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}

// only re-renders if this specific product's id/price/rating/name changes
export default memo(
  ProductCard,
  (prev, next) => prev.product._id === next.product._id,
);
