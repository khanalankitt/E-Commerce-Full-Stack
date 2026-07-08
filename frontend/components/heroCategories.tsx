import Image from "next/image";
import Link from "next/link";

export default function HeroCategories() {
  const categories = [
    {
      name: "Electronics",
      url: "/electronics.png",
      slug: "electronics",
    },
    {
      name: "Clothes",
      url: "/clothes.png",
      slug: "clothes",
    },
    {
      name: "Food Items",
      url: "/food.png",
      slug: "food-items",
    },
    {
      name: "Mobile and Laptops",
      url: "/laptops.png",
      slug: "mobile-and-laptops",
    },
  ];
  return (
    <section className="h-screen w-full flex-wrap flex items-center justify-center gap-x-10 gap-y-0 px-10 py-5 mt-7">
      {categories.map((category, index) => (
        <Link
          href={`/category/${category.slug}`}
          key={index}
          className="h-[45%] w-2/5 group rounded-xl shadow-sm flex cursor-pointer overflow-hidden relative"
        >
          <Image
            src={category.url}
            height={500}
            width={500}
            alt="Category Image"
            priority={true}
            loading="eager"
            className="h-full w-full object-cover absolute inset-0 -z-10 transition-all duration-300 group-hover:scale-105"
          />

          {/* Green gradient overlay - strong near text (bottom), fades out toward top */}
          <div className="absolute inset-0 bg-linear-to-t from-green-900/90 to-green-900/60" />

          <div className="flex flex-col items-start justify-end p-10 relative z-10">
            <p className="text-white">Shop by</p>
            <p className="text-3xl font-semibold text-white drop-shadow-md">
              {category.name}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}
