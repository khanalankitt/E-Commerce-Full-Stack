import { IProduct } from "@/app/types/product";
import Image from "next/image";
import Link from "next/link";

async function getFeaturedProducts() {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/products", {
    next: {
      revalidate: 3600,
      tags: ["products"],
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch featured products");
    return [];
  }

  const json = await res.json();
  return json.data;
}

export default async function FeaturedProducts() {
  const data = await getFeaturedProducts();

  return (
    <section className="h-auto w-full flex items-center justify-center">
      <div className="w-4/5 flex flex-col ">
        <p className="text-3xl pb-10">Featured Products</p>
        <div className="h-auto w-full flex items-center justify-center flex-wrap gap-2 gap-y-3 pb-10">
          {data.map((product: IProduct, index: number) => (
            <Link
              href={`/product/${product._id}`}
              key={index}
              className="h-auto w-[23%] rounded-t-lg shadow-sm relative group"
            >
              <Image
                src={product.image}
                height={200}
                width={300}
                alt="Product Image"
                priority={index < 4}
                className="rounded-t-lg object-cover"
              />
              <div className="flex flex-col p-2">
                <p className="line-clamp-1">{product.name}</p>
                <p className="text-green-600">
                  Rs.
                  <span className="font-semibold text-lg">
                    {product.price}
                  </span>{" "}
                </p>
                <p className="text-gray-500 text-sm">
                  ⭐ {product.rating} {"(7)"}{" "}
                  <span className="text-gray-300">|</span> 33 sold
                </p>
              </div>
              <button
                className="absolute top-3 right-3 h-10 w-10 hidden rounded-full border-2 
              border-green-700 justify-center items-center group-hover:flex p-1 bg-white backdrop-blur-sm cursor-pointer"
              >
                <p className="text-6xl font-extralight text-green-700">+</p>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
