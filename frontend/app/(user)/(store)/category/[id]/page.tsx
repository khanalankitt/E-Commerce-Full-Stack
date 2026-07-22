import CategoryClient from "@/components/category/categoryClient";
import { notFound } from "next/navigation";

export const revalidate = 3600;
export const dynamic = "force-static";

type Props = {
  params: Promise<{ id: string }>;
};

async function getProducts(slug: string) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + `/categories/products/${slug}`,
    {
      next: {
        tags: [`categories-${slug}`],
      },
    },
  );

  if (!res.ok) {
    console.error("Failed to fetch categories products");
    notFound();
  }

  const json = await res.json();
  return json;
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const products = await getProducts(id);

  return (
    <div className="min-h-screen w-full flex flex-col mt-14">
      <div className="w-full h-40 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-t from-green-900/90 to-green-900/90" />
        <p className="text-white text-5xl font-bold z-10">
          {products.category.name}
        </p>
      </div>

      <CategoryClient products={products.products} />
    </div>
  );
}
