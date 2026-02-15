import { Hero } from "@/src/components/home/hero";
import { FeaturedProducts } from "@/src/components/home/featured-products"
import { Features } from "@/src/components/home/features";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero />
        <Features />
        <FeaturedProducts />
      </main>
    </div>
  );
}