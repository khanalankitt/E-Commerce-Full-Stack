export const revalidate = 21600;
export const dynamic = "force-static";

import Image from "next/image";
import ProductPageAddToCartButton from "@/components/cart/productPageAddToCardButton";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/products", {
    next: {
      revalidate: 3600,
    },
  });

  const json = await res.json();

  return json.data?.map((product: { _id: string }) => ({
    id: product._id,
  }));
}

async function getProductDetails(id: string) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + `/products/${id}`,
    {
      next: {
        tags: [`product-${id}`],
      },
    },
  );

  if (!res.ok) {
    notFound();
  }

  const json = await res.json();
  return json.data;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const data = await getProductDetails(id);

  const reviews = Math.floor(Math.random() * (35 - 15 + 1)) + 15;
  const sold = Math.floor(Math.random() * (60 - (reviews + 1))) + (reviews + 1);

  return (
    <main className="min-h-screen bg-gray-50 py-10 pt-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:flex-row">
        <div className="flex-1 rounded-xl bg-white p-6 shadow">
          <div className="relative aspect-square w-full">
            <Image
              src={data?.image}
              alt={data?.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5">
          <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            {data?.category?.name}
          </span>

          <h1 className="text-4xl font-bold text-gray-900">{data?.name}</h1>

          <p className="text-3xl font-bold text-green-700 flex items-center justify-start gap-3">
            Rs. {data?.price}{" "}
            <span className="text-base text-gray-500 font-normal">
              ⭐ {data?.rating} ({reviews}){" "}
              <span className="text-gray-300">|</span> {sold} sold
            </span>
          </p>

          <p className="leading-7 text-gray-600">{data?.description}</p>

          <p className="text-sm">
            Availability:{" "}
            <span className="font-semibold text-green-700">
              {data?.stock} in stock
            </span>
          </p>

          <ProductPageAddToCartButton productId={data?._id} />
        </div>
      </div>
    </main>
  );
}
