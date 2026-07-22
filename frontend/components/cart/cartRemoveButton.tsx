"use client";

import { DeleteOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

export default function CartRemoveButton({ productId }: { productId: string }) {
  const handleLogoutConfirm = async (): Promise<boolean> => {
    const result = await Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to remove this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove",
    });

    return result.isConfirmed;
  };

  const handleDelete = async () => {
    const confirmed = await handleLogoutConfirm();
    if (!confirmed) {
      return;
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${productId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (!res.ok) {
      await Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Failed to remove item from cart",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    }
    const response = await res.json();

    if (response.success) {
      await Swal.fire({
        position: "center",
        icon: "success",
        title: "Success",
        text: response.message,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      window.location.reload();
    } else {
      await Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Failed to remove item from cart",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-gray-400 hover:text-red-500 transition cursor-pointer text-sm"
    >
      <DeleteOutlined
        style={{ color: "red", fontSize: "20px", padding: "8px" }}
        className="hover:bg-red-100 transition-all rounded-full"
      />
    </button>
  );
}
