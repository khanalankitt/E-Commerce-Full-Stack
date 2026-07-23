"use client";

import Swal from "sweetalert2";
import { useState } from "react";

export default function PlaceOrderFinalButton({
  orderId,
}: {
  orderId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handlePlace = async () => {
    const confirm = await Swal.fire({
      title: "Place this order?",
      text: "You won't be able to edit it after this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#15803d",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, place order",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/place`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message ?? "Failed to place order");
      }

      await Swal.fire({
        icon: "success",
        title: "Order placed!",
        text: "Thank you — your order is now being processed.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      window.location.href = `/orders/${orderId}`;
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Couldn't place order",
        text: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePlace}
      disabled={loading}
      className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl transition cursor-pointer font-semibold"
    >
      {loading ? "Placing order..." : "Place Order"}
    </button>
  );
}
