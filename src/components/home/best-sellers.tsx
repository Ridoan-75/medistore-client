import Link from "next/link";
import { ArrowRight, TrendingUp, Package, Sparkles } from "lucide-react";
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

export async function BestSellers() {
  const { data: medicines, error } = await productService.getAllProduct();

  const products: Product[] = medicines?.data?.data || [];
  const hasProducts = products.length > 0;

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium text-sm">
                Trending Now
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Best{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Selling
              </span>{" "}
              Products
            </h2>

            <p className="text-muted-foreground max-w-md">
              Our most popular products loved by thousands of customers
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="border-2 hover:border-primary/50 hover:bg-primary/5"
          >
            <Link href="/shop" className="flex items-center gap-2">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {hasProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
                : "Check back soon for our best selling products!"}
            </p>

            <Button asChild variant="outline" className="border-2">
              <Link href="/shop">Browse All Products</Link>
            </Button>
          </div>
        )}

        {hasProducts && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-2xl border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                New products added weekly!{" "}
                <Link
                  href="/shop"
                  className="text-primary hover:underline font-semibold"
                >
                  Explore now →
                </Link>
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}