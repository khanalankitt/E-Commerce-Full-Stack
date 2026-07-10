export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
}

async function getOrders(): Promise<Order[]> {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (!res.ok) return [];

  const json = await res.json();
  return json.data ?? [];
}

const statusStyles: Record<Order["status"], string> = {
  PENDING: "bg-gray-100 text-gray-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="min-h-screen w-full mt-14">
      <div className="max-w-4xl mx-auto px-5 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 gap-4 py-24">
            <p className="text-5xl">📦</p>
            <p className="text-lg">You haven&apos;t placed any orders yet</p>
            <Link
              href="/"
              className="mt-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const previewItems = order.items.slice(0, 3);
              const extraCount = order.items.length - previewItems.length;

              return (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="block bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-green-600 transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {previewItems.map((item, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 relative bg-gray-100 rounded-lg border-2 border-white shrink-0"
                        >
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1 rounded-lg"
                          />
                        </div>
                      ))}
                      {extraCount > 0 && (
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 border-2 border-white rounded-lg text-xs font-medium text-gray-600 shrink-0">
                          +{extraCount}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 truncate">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <p className="font-bold text-gray-800">
                      Rs.{order.totalAmount}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
