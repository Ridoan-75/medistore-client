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
  FileText,
  ClipboardList,
  MessageSquare,
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
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% Protected",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30 Day Policy",
  },
];

const getStockBadgeConfig = (status: ProductStatus, stock: number): StockBadgeConfig => {
  if (status === "AVAILABLE" && stock > 0) {
    return {
      text: "In Stock",
      className: "bg-emerald-600 text-white",
      icon: CheckCircle,
    };
  }

  if (stock <= 0) {
    return {
      text: "Out of Stock",
      className: "bg-red-600 text-white",
      icon: XCircle,
    };
  }

  return {
    text: status,
    className: "bg-amber-600 text-white",
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
  const session = sessionResult.data;
  const isLoggedIn = !!(session?.user?.id);
  const userId = session?.user?.id;
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link
              href="/shop"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              Shop
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 dark:text-gray-100 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <Image
                src={product.imageUrl || "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop"}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              <Badge className={`absolute top-4 right-4 ${stockBadge.className} flex items-center gap-1.5 px-3 py-1.5`}>
                <StockIcon className="h-4 w-4" />
                {stockBadge.text}
              </Badge>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-0.5">
                      {feature.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <Tag className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-1"
                role="img"
                aria-label={`Rating: ${averageRating.toFixed(1)} out of 5 stars`}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : i < averageRating
                          ? "fill-amber-400/50 text-amber-400"
                          : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                {averageRating > 0 && (
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {averageRating.toFixed(1)}
                  </span>
                )}{" "}
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {formatPrice(price)}
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.stock > 10
                    ? "bg-emerald-500"
                    : product.stock > 0
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {product.stock > 0
                  ? `${product.stock} items available`
                  : "Currently out of stock"}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Add to Cart */}
            <div className="pt-2">
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

        {/* Tabs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 h-auto p-0 rounded-none">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 px-6 py-3 font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 px-6 py-3 font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <ClipboardList className="h-4 w-4" />
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 px-6 py-3 font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-6 md:p-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Product Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="p-6 md:p-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Product Specifications
                </h3>

                <div className="space-y-3">
                  {specifications.map((spec) => {
                    const Icon = spec.icon;
                    return (
                      <div
                        key={spec.label}
                        className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-0.5">
                            {spec.label}
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {spec.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-6 md:p-8">
              <ProductReviews
                medicineId={id}
                initialReviews={reviews}
                userReview={userReview}
                isLoggedIn={isLoggedIn}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}