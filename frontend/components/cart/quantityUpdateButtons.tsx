"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function QuantityUpdateButton({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [loading, setLoading] = useState(false);

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    const previous = itemQuantity;
    setItemQuantity(newQuantity); // optimistic
    setLoading(true);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/cart/${productId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ quantity: newQuantity }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to update quantity");
    } catch (error) {
      console.error(error);
      setItemQuantity(previous); // rollback
      await Swal.fire({
        icon: "error",
        title: "Couldn't update quantity",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        disabled={loading || itemQuantity <= 1}
        onClick={() => updateQuantity(itemQuantity - 1)}
        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
      >
        −
      </button>
      <span className="font-medium w-5 text-center tabular-nums">
        {itemQuantity}
      </span>
      <button
        disabled={loading}
        onClick={() => updateQuantity(itemQuantity + 1)}
        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition cursor-pointer"
      >
        +
      </button>
    </div>
  );
}
