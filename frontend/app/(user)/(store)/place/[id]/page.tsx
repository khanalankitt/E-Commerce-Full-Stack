import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import PlaceOrderFinalButton from "@/components/placeOrderButton";

interface OrderItem {
  price: number;
  product: {
    image: string;
    name: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  address: {
    fullName: string;
    phoneNumber: string;
    email: string;
    city: string;
    area: string;
    fullAddress: string;
  };
  paymentMethod: string;
  totalAmount: number;
  status: string;
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

export default async function PlaceOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    redirect("/cart");
  }

  if (order.status !== "PENDING") {
    // already finalized or in a later stage — nothing to confirm here
    redirect(`/orders/${order._id}`);
  }

  return (
    <div className="min-h-screen w-full mt-14">
      <div className="max-w-3xl mx-auto px-5 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Review & Place Order
        </h1>
        <p className="text-gray-500 mb-8">
          Double-check everything below — once placed, this order cannot be
          edited.
        </p>

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

        {/* Payment + Total */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Payment Method</span>
            <span className="font-medium text-gray-800">
              {order.paymentMethod === "COD"
                ? "Cash on Delivery"
                : order.paymentMethod}
            </span>
          </div>
          <div className="border-t border-gray-200 mt-3 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-green-700">Rs.{order.totalAmount}</span>
          </div>
        </div>

        {/* Notices */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm mb-6 flex flex-col gap-1">
          <p>💵 Please keep exact cash ready at the time of delivery.</p>
          <p>
            ⚠️ Once placed, this order cannot be edited or cancelled from the
            app.
          </p>
        </div>

        <PlaceOrderFinalButton orderId={order._id} />
      </div>
    </div>
  );
}
