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
  Sparkles,
  Award,
  Zap,
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
    gradient: "from-blue-400 to-cyan-600",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% Protected",
    gradient: "from-emerald-400 to-teal-600",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30 Day Policy",
    gradient: "from-violet-400 to-purple-600",
  },
];

const getStockBadgeConfig = (status: ProductStatus, stock: number): StockBadgeConfig => {
  if (status === "AVAILABLE" && stock > 0) {
    return {
      text: "In Stock",
      className: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-xl shadow-emerald-500/30",
      icon: CheckCircle,
    };
  }

  if (stock <= 0) {
    return {
      text: "Out of Stock",
      className: "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-xl shadow-red-500/30",
      icon: XCircle,
    };
  }

  return {
    text: status,
    className: "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-xl shadow-amber-500/30",
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-white to-indigo-50/30 dark:from-sky-950/20 dark:via-slate-900 dark:to-indigo-950/20">
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-violet-500/10 py-8 border-b border-sky-200/50 dark:border-sky-800/50">
          <div className="absolute inset-0 backdrop-blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <nav className="flex items-center gap-3 text-sm flex-wrap font-medium">
              <Link
                href="/"
                className="text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <Link
                href="/shop"
                className="text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors"
              >
                Shop
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-semibold line-clamp-1">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <section className="py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20">
              <div className="space-y-6">
                <div className="group relative aspect-square bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-2xl">
                  <Image
                    src={product.imageUrl || "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <Badge className={`absolute top-6 right-6 ${stockBadge.className} flex items-center gap-2 px-5 py-2.5 font-black text-base rounded-2xl`}>
                    <StockIcon className="h-5 w-5" />
                    {stockBadge.text}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {FEATURES.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={feature.title}
                        className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-sky-500/50 transition-all duration-500 hover:-translate-y-1 text-center"
                      >
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <p className="font-black text-slate-900 dark:text-white text-sm mb-1">
                          {feature.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                          {feature.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8">
                {product.category && (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 backdrop-blur-xl rounded-full border border-sky-500/30 shadow-lg shadow-sky-500/10">
                    <Tag className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                    <span className="text-sm font-bold text-sky-700 dark:text-sky-300 tracking-wide">
                      {product.category.name.toUpperCase()}
                    </span>
                  </div>
                )}

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 flex-wrap">
                  <div
                    className="flex items-center gap-1.5"
                    role="img"
                    aria-label={`Rating: ${averageRating.toFixed(1)} out of 5 stars`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 transition-all duration-300 ${
                          i < Math.floor(averageRating)
                            ? "fill-amber-400 text-amber-400 scale-110"
                            : i < averageRating
                              ? "fill-amber-400/50 text-amber-400"
                              : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />

                  <span className="text-base text-slate-600 dark:text-slate-400 font-semibold">
                    {averageRating > 0 && (
                      <span className="font-black text-slate-900 dark:text-white text-xl">
                        {averageRating.toFixed(1)}
                      </span>
                    )}{" "}
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>

                <div className="flex items-baseline gap-4">
                  <span className="text-5xl md:text-6xl font-black bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    {formatPrice(price)}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-800">
                  <div
                    className={`w-3 h-3 rounded-full animate-pulse ${
                      product.stock > 10
                        ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                        : product.stock > 0
                          ? "bg-amber-500 shadow-lg shadow-amber-500/50"
                          : "bg-red-500 shadow-lg shadow-red-500/50"
                    }`}
                  />
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {product.stock > 0
                      ? `${product.stock} items available`
                      : "Currently out of stock"}
                  </span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium">
                  {product.description}
                </p>

                <div className="pt-4">
                  <ProductQuantitySelector
                    productId={product.id}
                    productName={product.name}
                    price={price}
                    imageUrl={product.imageUrl || "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop"}
                    stock={product.stock}
                    manufacturer={product.manufacturer}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b-2 border-slate-200 dark:border-slate-800 bg-transparent h-auto p-0 mb-10 overflow-x-auto">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-4 border-transparent data-[state=active]:border-sky-600 data-[state=active]:bg-transparent data-[state=active]:text-sky-600 dark:data-[state=active]:text-sky-400 px-8 py-5 font-black text-base transition-all hover:text-sky-600 dark:hover:text-sky-400"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="rounded-none border-b-4 border-transparent data-[state=active]:border-sky-600 data-[state=active]:bg-transparent data-[state=active]:text-sky-600 dark:data-[state=active]:text-sky-400 px-8 py-5 font-black text-base transition-all hover:text-sky-600 dark:hover:text-sky-400"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-4 border-transparent data-[state=active]:border-sky-600 data-[state=active]:bg-transparent data-[state=active]:text-sky-600 dark:data-[state=active]:text-sky-400 px-8 py-5 font-black text-base transition-all hover:text-sky-600 dark:hover:text-sky-400"
                >
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                      Product Description
                    </h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium">
                    {product.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="specifications">
                <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <Award className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                      Product Specifications
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    {specifications.map((spec, index) => {
                      const Icon = spec.icon;
                      return (
                        <div
                          key={spec.label}
                          className={`group flex items-center gap-6 p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 ${
                            index % 2 === 0 
                              ? "bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-500/50 hover:shadow-lg" 
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-500/50 hover:shadow-lg"
                          }`}
                        >
                          <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <Icon className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-bold mb-1">
                              {spec.label}
                            </p>
                            <p className="font-black text-slate-900 dark:text-white text-lg">
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
                <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl">
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