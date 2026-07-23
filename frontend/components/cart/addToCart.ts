"use client";

import Swal from "sweetalert2";

export const addToCart = async (
  e: React.MouseEvent<HTMLButtonElement>,
  productId: string,
  quantity: number,
) => {
  e.preventDefault();
  const res = await fetch(`/api/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, quantity }),
    credentials: "include",
  });

  if (res.status === 401) {
    await Swal.fire({
      position: "center",
      icon: "warning",
      title: "Login to continue shopping!",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Add to cart failed!",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });
  }

  const data = await res.json();

  if (data.success) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Succesfully added to cart!",
      showConfirmButton: false,
      timer: 700,
      timerProgressBar: true,
    });
  }
};
