"use client";

import { DeleteOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

export default function ClearCartButton() {
  const handleLogoutConfirm = async (): Promise<boolean> => {
    const result = await Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to clear the cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear",
    });

    return result.isConfirmed;
  };

  const handleDelete = async () => {
    const confirmed = await handleLogoutConfirm();
    if (!confirmed) {
      return;
    }
    const res = await fetch(`/api/cart`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      await Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Failed to clear the cart",
        showConfirmButton: false,
        timer: 1500,
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
        timer: 1500,
        timerProgressBar: true,
      });
      window.location.reload();
    } else {
      await Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Failed to clear the cart",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-gray-400 hover:text-red-500 transition cursor-pointer text-sm flex items-center justify-center hover:bg-red-100 p-2 px-4 rounded-full"
    >
      <DeleteOutlined
        style={{
          color: "red",
          fontSize: "20px",
        }}
        className=""
      />
      <span className="text-red-600 ml-1">Clear Cart</span>
    </button>
  );
}
