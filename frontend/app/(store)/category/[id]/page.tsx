import CategoryClient from "../../../../components/category/categoryClient";

export const revalidate = 3600;
export const dynamic = "force-static";

export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
}

async function getProducts(): Promise<Product[]> {
  // swap this for your real DB/API call (Mongoose, fetch, etc.)
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: 99 + i * 10,
    rating: [5, 4, 3, 5, 4, 5, 3, 4, 5, 4, 3, 5][i],
  }));
}

export default async function CategoryPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen w-full flex flex-col mt-14">
      <div className="w-full h-40 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-t from-green-900/90 to-green-900/90" />
        <p className="text-white text-5xl font-bold z-10">Category</p>
      </div>

      <CategoryClient products={products} />
    </div>
  );
}
