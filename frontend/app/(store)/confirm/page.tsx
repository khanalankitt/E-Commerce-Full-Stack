"use client";

import Link from "next/link";
import Swal from "sweetalert2";

export default function PlaceOrderButton() {
  const handlePlaceOrder = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/orders", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Order failed");
      }

      await Swal.fire({
        icon: "success",
        title: "Order placed!",
        text: "Your order has been confirmed.",
        showConfirmButton: false,
        timer: 1500,
      });

      window.location.href = "/orders";
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Could not place your order. Please try again.",
      });
    }
  };

  return (
    <Link
      href="/confirm"
      onClick={handlePlaceOrder}
      className="w-full bg-green-700 block text-center hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl transition cursor-pointer font-medium"
    >
      Confirm Order
    </Link>
  );
}
