import CartRemoveButton from "@/components/cart/cartRemoveButton";
import ClearCartButton from "@/components/cart/clearCartButton";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  product: CartProduct;
  quantity: number;
}

async function getCartItems(): Promise<CartItem[]> {
  const cookieStore = await cookies();

  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/cart`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch cart items");
    return [];
  }

  const json = await res.json();
  return json.data?.items ?? [];
}

export default async function CartPage() {
  const items = await getCartItems();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen w-full mt-14">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex h-auto justify-start items-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center gap-5">
            Your Cart
            {items.length != 0 && (
              <span className="font-normal">
                <ClearCartButton />
              </span>
            )}
          </h1>
        </div>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 gap-4 py-24">
            <p className="text-5xl">🛒</p>
            <p className="text-lg">Your cart is empty</p>
            <Link
              href="/"
              className="mt-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Items */}
            <div className="flex-1 flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
                >
                  <div className="w-24 h-24 relative bg-gray-100 rounded-xl shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2 rounded-xl"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-800">
                        {item.product.name}
                      </h3>
                    </div>

                    <p className="text-green-700 font-bold text-lg">
                      Rs.{item.product.price}
                    </p>

                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition cursor-pointer">
                        −
                      </button>
                      <span className="font-medium w-5 text-center">
                        {item.quantity}
                      </span>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition cursor-pointer">
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right relative">
                    <p className="font-bold text-gray-800">
                      Rs.{item.product.price * item.quantity}
                    </p>
                    <div className="absolute bottom-1 right-1">
                      <CartRemoveButton productId={String(item.product._id)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="w-full lg:w-80">
              <div className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-white sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>Rs.{totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-4">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span className="text-green-700">Rs.{totalPrice}</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-green-700 hover:bg-green-800 text-white py-3 block text-center rounded-xl transition cursor-pointer font-medium"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/"
                  className="block text-center text-sm text-green-700 hover:underline mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
