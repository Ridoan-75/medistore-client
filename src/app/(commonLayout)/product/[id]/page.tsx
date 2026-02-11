import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productService } from "@/src/services/product.service";
import { reviewService } from "@/src/services/review.service";
import { userService } from "@/src/services/user.service";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Star,
  Truck,
  Shield,
  RefreshCw,
  ChevronRight,
  Package,
  Factory,
  Tag,
  Boxes,
  CheckCircle,
  XCircle,
  Clock,
  LucideIcon,
} from "lucide-react";
import { ProductQuantitySelector } from "./product-quantity-selector";
import { ProductReviews } from "./product-reviews";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

interface Specification {
  label: string;
  value: string;
  icon: LucideIcon;
}

type ProductStatus = "AVAILABLE" | "UNAVAILABLE" | "DISCONTINUED";

interface StockBadgeConfig {
  text: string;
  className: string;
  icon: LucideIcon;
}

const FEATURES: Feature[] = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Orders over ৳500",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% Protected",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30 Day Policy",
    gradient: "from-purple-500 to-indigo-500",
  },
];

const getStockBadgeConfig = (status: ProductStatus, stock: number): StockBadgeConfig => {
  if (status === "AVAILABLE" && stock > 0) {
    return {
      text: "In Stock",
      className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0",
      icon: CheckCircle,
    };
  }

  if (stock <= 0) {
    return {
      text: "Out of Stock",
      className: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0",
      icon: XCircle,
    };
  }

  return {
    text: status,
    className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0",
    icon: Clock,
  };
};

const calculateAverageRating = (reviews: { rating: number }[]): number => {
  if (reviews.length === 0) return 0;
  return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
};

const formatPrice = (price: number): string => `৳${price.toFixed(2)}`;

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  const [productResult, reviewsResult, sessionResult] = await Promise.all([
    productService.getProductById(id),
    reviewService.getMedicineReviews(id),
    userService.getSession(),
  ]);

  const { data: product, error } = productResult;

  if (error || !product) {
    notFound();
  }

  const price = parseFloat(product.price as string);
  if (isNaN(price)) {
    notFound();
  }

  const reviews = reviewsResult.data || [];
  const isLoggedIn = !!sessionResult.data;
  const userId = sessionResult.data?.user?.id;
  const userReview = reviews.find((r) => r.user?.id === userId) || null;
  const averageRating = calculateAverageRating(reviews);
  const stockBadge = getStockBadgeConfig(product.status as ProductStatus, product.stock);
  const StockIcon = stockBadge.icon;

  const specifications: Specification[] = [
    {
      label: "Category",
      value: product.category?.name || "N/A",
      icon: Tag,
    },
    {
      label: "Manufacturer",
      value: product.manufacturer || "N/A",
      icon: Factory,
    },
    {
      label: "Status",
      value: product.status,
      icon: Package,
    },
    {
      label: "Stock",
      value: `${product.stock} units`,
      icon: Boxes,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-6">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="container mx-auto px-4 relative">
            <nav className="flex items-center gap-2 text-sm flex-wrap">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link
                href="/shop"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Shop
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium line-clamp-1">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              <div className="space-y-4">
                <div className="group relative aspect-square bg-muted rounded-2xl overflow-hidden border border-border shadow-lg">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <Badge className={`absolute top-4 right-4 ${stockBadge.className} shadow-lg flex items-center gap-1.5 px-3 py-1.5`}>
                    <StockIcon className="h-3.5 w-3.5" />
                    {stockBadge.text}
                  </Badge>
                </div>
              </div>

              <div className="space-y-6">
                {product.category && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                    <Tag className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {product.category.name}
                    </span>
                  </div>
                )}

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 flex-wrap">
                  <div
                    className="flex items-center gap-1"
                    role="img"
                    aria-label={`Rating: ${averageRating.toFixed(1)} out of 5 stars`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 transition-colors ${
                          i < Math.floor(averageRating)
                            ? "fill-amber-400 text-amber-400"
                            : i < averageRating
                              ? "fill-amber-400/50 text-amber-400"
                              : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="h-5 w-px bg-border" />

                  <span className="text-sm text-muted-foreground">
                    {averageRating > 0 && (
                      <span className="font-semibold text-foreground">
                        {averageRating.toFixed(1)}
                      </span>
                    )}{" "}
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    {formatPrice(price)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      product.stock > 10
                        ? "bg-green-500"
                        : product.stock > 0
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {product.stock > 0
                      ? `${product.stock} items available`
                      : "Currently out of stock"}
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed text-lg">
                  {product.description}
                </p>

                <div className="pt-4">
                  <ProductQuantitySelector
                    productId={product.id}
                    productName={product.name}
                    price={price}
                    imageUrl={product.imageUrl || "/placeholder.svg"}
                    stock={product.stock}
                    manufacturer={product.manufacturer}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-border">
                  {FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={feature.title}
                        className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:shadow-md hover:border-primary/20 transition-all"
                      >
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {feature.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b border-border bg-transparent h-auto p-0 mb-8 overflow-x-auto">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-6 py-4 font-semibold transition-colors"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-6 py-4 font-semibold transition-colors"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-6 py-4 font-semibold transition-colors"
                >
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Product Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {product.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="specifications">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    Product Specifications
                  </h3>

                  <div className="grid gap-4">
                    {specifications.map((spec, index) => {
                      const Icon = spec.icon;
                      return (
                        <div
                          key={spec.label}
                          className={`flex items-center gap-4 p-4 rounded-xl ${
                            index % 2 === 0 ? "bg-muted/50" : "bg-transparent"
                          }`}
                        >
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                              {spec.label}
                            </p>
                            <p className="font-semibold text-foreground">
                              {spec.value}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                  <ProductReviews
                    medicineId={id}
                    initialReviews={reviews}
                    userReview={userReview}
                    isLoggedIn={isLoggedIn}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
}