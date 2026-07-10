"use client";

import Swal from "sweetalert2";
import { useShipping } from "@/app/contexts/shippingContext";
import Link from "next/link";

export default function ConfirmOrderButton() {
  const { selectedAddressId } = useShipping();

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || selectedAddressId === "new") {
      await Swal.fire({
        icon: "warning",
        title: "Select a shipping address",
        text: "Please choose or save a shipping address before placing your order.",
      });
      return;
    }

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId: selectedAddressId }),
        credentials: "include",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message ?? "Order failed");
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
        text: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <Link
      href="/confirm"
      type="button"
      onClick={handlePlaceOrder}
      className="w-full block text-center bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl transition cursor-pointer font-medium"
    >
      Confirm Order
    </Link>
  );
}
