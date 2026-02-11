import { Hero } from "@/src/components/home/hero";
import { FeaturedProducts } from "@/src/components/home/featured-products";
import { PromoBanners } from "@/src/components/home/promo-banners";
import { BestSellers } from "@/src/components/home/best-sellers";
import { BlogSection } from "@/src/components/home/blog-section";
import { Testimonials } from "@/src/components/home/testimonials";
import { Features } from "@/src/components/home/features";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <PromoBanners />
        <BestSellers />
        <BlogSection />
        <Testimonials />
        <Features />
      </main>
    </div>
  );
}
