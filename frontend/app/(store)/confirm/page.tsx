"use client";

import Swal from "sweetalert2";
import { useState } from "react";

export default function PlaceOrderButton() {
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlaceOrder}
      disabled={loading}
      className="w-full bg-green-700 mt-20 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl transition cursor-pointer font-medium"
    >
      {loading ? "Placing order..." : "Confirm & Place Order"}
    </button>
  );
}
