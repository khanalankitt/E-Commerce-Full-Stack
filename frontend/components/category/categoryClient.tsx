"use client";

import { useMemo, useState } from "react";
import { StarFilled } from "@ant-design/icons";
import ProductCard from "./productCard";
import { IProduct } from "@/app/types/product";
import { useDebounce } from "@/app/(user)/(store)/category/[id]/useDebounce";

type SortOption = "newest" | "price-asc" | "price-desc" | "best-selling";

export default function CategoryClient({ products }: { products: IProduct[] }) {
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");

  // debounced values — these drive the actual filtering
  const debouncedSearch = useDebounce(search, 300);
  const debouncedMaxPrice = useDebounce(maxPrice, 200);

  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    const result = products.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query)) return false;
      if (p.price > debouncedMaxPrice) return false;
      if (minRating !== null && p.rating < minRating) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "best-selling":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, debouncedSearch, debouncedMaxPrice, minRating, sort]);

  const handleReset = () => {
    setSearch("");
    setMaxPrice(50000);
    setMinRating(null);
  };

  const hasActiveFilters =
    search !== "" || maxPrice !== 50000 || minRating !== null;

  return (
    <div className="max-w-7xl w-full mx-auto px-5 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-72">
          <div className="border border-gray-400 rounded-2xl p-6 shadow-sm bg-white sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-gray-400 rounded-lg px-4 py-2 outline-none focus:border-green-600"
              />
            </div>

            {/* Price */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Price</h3>
              <input
                type="range"
                min={0}
                max={50000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full cursor-pointer accent-green-700"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Rs.0</span>
                <span>Rs.{maxPrice}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-8">
              <h3 className="font-medium mb-3">Rating</h3>
              {[5, 4, 3].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === rating}
                    onChange={() => setMinRating(rating)}
                    className="cursor-pointer"
                  />
                  <div className="flex text-yellow-500">
                    {Array.from({ length: rating }).map((_, i) => (
                      <StarFilled key={i} />
                    ))}
                  </div>
                  <span className="text-sm">& Up</span>
                </label>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="w-full border border-green-700 text-green-700 hover:bg-green-50 py-3 rounded-xl transition cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </aside>

        {/* Products */}
        <section className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filtered.length}</span>{" "}
              products
            </p>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="border rounded-lg px-4 py-2 outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="best-selling">Best Selling</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-20">
              No products match your filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
