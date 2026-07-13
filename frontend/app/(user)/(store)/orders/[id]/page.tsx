export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Address {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  area: string;
  fullAddress: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  address: Address;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
}

async function getOrder(orderId: string): Promise<Order | null> {
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${orderId}`,
    {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    },
  );

  if (!res.ok) return null;

  const json = await res.json();
  return json.data;
}

const statusSteps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

const statusStyles: Record<Order["status"], string> = {
  PENDING: "bg-gray-100 text-gray-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    redirect("/orders");
  }

  // Order hasn't actually been placed yet — send back to the review/confirm step
  if (order.status === "PENDING") {
    redirect(`/place/${order._id}`);
  }

  const currentStepIndex = statusSteps.indexOf(
    order.status as (typeof statusSteps)[number],
  );
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="min-h-screen w-full mt-14">
      <div className="max-w-3xl mx-auto px-5 py-10">
        <div className="text-sm mb-4">
          <Link href="/orders" className="text-green-700 hover:underline">
            Orders
          </Link>
          <span className="text-gray-400 mx-1.5">{">"}</span>
          <span className="text-gray-500">Details</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[order.status]}`}
          >
            {order.status}
          </span>
        </div>
        <p className="text-gray-500 mb-8">
          Order #{order._id.slice(-8).toUpperCase()} · Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Status tracker */}
        {!isCancelled && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, i) => (
                <div
                  key={step}
                  className="flex-1 flex flex-col items-center relative"
                >
                  {i !== 0 && (
                    <div
                      className={`absolute top-3 right-1/2 w-full h-0.5 -z-0 ${
                        i <= currentStepIndex ? "bg-green-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 ${
                      i <= currentStepIndex
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <p
                    className={`text-xs mt-2 text-center ${
                      i <= currentStepIndex
                        ? "text-gray-800 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {step.charAt(0) + step.slice(1).toLowerCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
            This order was cancelled.
          </div>
        )}

        {/* Shipping Address */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-3">Shipping To</h2>
          <p className="font-medium text-gray-800">{order.address.fullName}</p>
          <p className="text-sm text-gray-600">
            {order.address.phoneNumber} · {order.address.email}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {order.address.fullAddress}, {order.address.area},{" "}
            {order.address.city}
          </p>
        </div>

        {/* Items */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Items ({order.items.length})
          </h2>
          <div className="flex flex-col gap-4">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="w-16 h-16 relative bg-gray-100 rounded-xl shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    height={70}
                    width={70}
                    className="object-contain p-1 rounded-xl"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × Rs.{item.price}
                  </p>
                </div>
                <p className="font-semibold text-gray-800">
                  Rs.{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Payment Method</span>
            <span className="font-medium text-gray-800">Cash on Delivery</span>
          </div>
          <div className="border-t border-gray-200 mt-3 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-green-700">Rs.{order.totalAmount}</span>
          </div>
        </div>

        <Link
          href="/orders"
          className="block text-center text-sm text-green-700 hover:underline"
        >
          Back to My Orders
        </Link>
      </div>
    </div>
  );
}
