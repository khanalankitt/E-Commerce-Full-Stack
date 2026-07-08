import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

async function getCart(): Promise<CartItem[]> {
  // replace with your real fetch from DB/API
  return [
    { id: 1, name: "Product 1", price: 99, image: "/logo.png", quantity: 2 },
    { id: 2, name: "Product 4", price: 129, image: "/logo.png", quantity: 1 },
  ];
}

export default async function CheckoutPage() {
  const items = await getCart();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen w-full mt-14">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Shipping + Payment */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Shipping Details */}
            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-white">
              <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-green-600 sm:col-span-2"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-green-600"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-green-600"
                />
                <input
                  type="text"
                  placeholder="City"
                  className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-green-600"
                />
                <input
                  type="text"
                  placeholder="Area / Locality"
                  className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-green-600"
                />
                <textarea
                  placeholder="Full Address"
                  rows={3}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-green-600 sm:col-span-2 resize-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-white">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 cursor-pointer hover:border-green-600 transition">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="cursor-pointer"
                  />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-96">
            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-white sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-14 h-14 relative bg-gray-100 rounded-lg shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                      <span className="absolute top-0 right-0 bg-green-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">Rs.{item.price}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      Rs.{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs.{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Rs.{shipping}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-3 pt-4 flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span className="text-green-700">Rs.{total}</span>
              </div>

              <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl transition cursor-pointer font-medium">
                Place Order
              </button>

              <Link
                href="/cart"
                className="block text-center text-sm text-green-700 hover:underline mt-4"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
