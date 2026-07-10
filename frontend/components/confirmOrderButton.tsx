"use client";

import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useShipping } from "@/app/contexts/shippingContext";

export default function ConfirmOrderButton() {
  const { selectedAddressId } = useShipping();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!selectedAddressId || selectedAddressId === "new") {
      await Swal.fire({
        icon: "warning",
        title: "Select a shipping address",
        text: "Please choose or save a shipping address before continuing.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId: selectedAddressId }),
        credentials: "include",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(
          errJson?.message ?? "Could not continue to order review",
        );
      }

      const json = await res.json();
      router.push(`/place/${json.data._id}`);
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleContinue}
      disabled={loading}
      className="w-full block text-center bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl transition cursor-pointer font-medium"
    >
      Confirm Order
    </button>
  );
}
