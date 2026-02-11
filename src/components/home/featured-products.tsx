import Link from "next/link";
import { ArrowRight, Star, Package, Sparkles, Award } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { productService } from "@/src/services/product.service";
import { ProductCard } from "../products/product-card";

interface Product {
  id: string;
  name: string;
  price: number | string;
  imageUrl?: string;
  stock: number;
  status: string;
  category?: {
    id: string;
    name: string;
  };
}

export async function FeaturedProducts() {
  const { data: medicines, error } = await productService.getAllProduct();

  const products: Product[] = medicines?.data?.data || [];
  const hasProducts = products.length > 0;

  return (
    <section className="py-16 md:py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/20">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="text-amber-600 dark:text-amber-400 font-medium text-sm">
                Featured Collection
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Featured{" "}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Products
              </span>
            </h2>

            <p className="text-muted-foreground max-w-md">
              Hand-picked quality healthcare products for you and your family
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="border-2 hover:border-amber-500/50 hover:bg-amber-500/5"
          >
            <Link href="/shop" className="flex items-center gap-2">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {hasProducts ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product, index) => (
                <div key={product.id} className="relative">
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border-2 border-background"
                    />
                  ))}
                </div>
                <span>
                  <strong className="text-foreground">500+</strong> happy customers
                </span>
              </div>

              <div className="hidden sm:block w-px h-6 bg-border" />

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <span>
                  <strong className="text-foreground">4.9</strong> average rating
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-card border-2 border-dashed border-border rounded-2xl">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              {error ? "Unable to Load Products" : "No Products Available"}
            </h3>

            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              {error
                ? error.message
                : "Check back soon for our featured products!"}
            </p>

            <Button asChild variant="outline" className="border-2">
              <Link href="/shop">Browse All Products</Link>
            </Button>
          </div>
        )}

        {hasProducts && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-2xl border border-amber-500/20">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-foreground">
                Quality guaranteed!{" "}
                <Link
                  href="/about"
                  className="text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                >
                  Learn about our promise →
                </Link>
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}