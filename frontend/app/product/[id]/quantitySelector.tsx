"use client";

import { useState } from "react";

export default function QuantitySelector() {
  const [count, setCount] = useState(1);

  const handleUpdate = (op: string) => {
    switch (op) {
      case "-":
        count >= 2 ? setCount((prev) => prev - 1) : null;
        break;

      case "+":
        count >= 1 ? setCount((prev) => prev + 1) : null;
        break;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="font-medium">Quantity</span>

      <button
        onClick={() => handleUpdate("-")}
        className="h-10 w-10 rounded border hover:bg-gray-100 cursor-pointer"
      >
        -
      </button>

      <span className="w-10 text-center font-semibold">{count}</span>

      <button
        onClick={() => handleUpdate("+")}
        className="h-10 w-10 rounded border hover:bg-gray-100 cursor-pointer"
      >
        +
      </button>
    </div>
  );
}
