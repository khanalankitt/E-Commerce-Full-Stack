export const dynamic = "force-static";
export const revalidate = 3600;

import FeaturedProducts from "@/components/featuredProducts";
import Footer from "@/components/footer";
import HeroCategories from "@/components/heroCategories";
import NavBar from "@/components/navbar";

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col flex-1 justify-center items-center">
      <NavBar />
      <HeroCategories />
      <FeaturedProducts />
      <Footer />
    </div>
  );
}
