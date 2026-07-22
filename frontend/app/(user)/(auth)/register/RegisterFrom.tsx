"use client";

import React, { useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function RegisterFormComponent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [hidden, setHidden] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/register",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(form),
          credentials: "include",
        },
      );

      if (!res.ok) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Registration failed!",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }

      const data = await res.json();
      if (data.success) {
        await Swal.fire({
          position: "center",
          icon: "success",
          title: "Registration Succesfull!",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        setForm({ name: "", email: "", password: "" });
        router.replace("/");
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Registration failed!",
          text: data.message,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="h-auto w-full" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium text-sm">Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium text-sm">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium text-sm">Password</span>
          <div className="w-full h-full flex relative">
            <input
              type={hidden ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="border w-full border-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {hidden ? (
              <EyeInvisibleOutlined
                onClick={() => setHidden((prev) => !prev)}
                size={25}
                className="absolute top-2 right-1 p-1 text-gray-500 transition-all hover:bg-gray-100 rounded-xl cursor-pointer"
              />
            ) : (
              <EyeOutlined
                onClick={() => setHidden((prev) => !prev)}
                size={25}
                className="absolute top-2 right-1 p-1 text-gray-500 transition-all hover:bg-gray-100 rounded-xl cursor-pointer"
              />
            )}
          </div>
        </label>
        <button
          type="submit"
          className="w-full bg-green-700 text-white font-semibold py-2 cursor-pointer rounded hover:bg-green-800 transition-all"
        >
          {loading ? "Please wait..." : "Register"}
        </button>
      </div>
    </form>
  );
}
