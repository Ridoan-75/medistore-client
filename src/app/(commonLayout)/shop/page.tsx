import { productService } from "@/src/services/product.service";
import { ShopFilters } from "./shop-filters";
import { ShopProductList } from "./shop-product-list";
import { allCategoriesAction } from "@/src/actions/category.action";

interface ShopPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const [categoriesResult, productsResult] = await Promise.all([
    allCategoriesAction(),
    productService.getAllProduct({
      search: params.search,
      category: params.category,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      page: params.page || "1",
      limit: params.limit || "12",
    }),
  ]);

  const categories = categoriesResult.data || [];
  const productsData = productsResult.data;
  const products = productsData?.data?.data || [];
  const meta = productsData?.data?.pagination;
  const totalProducts = meta?.total || products.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Shop
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse our wide selection of medical supplies and healthcare products
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop only */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-6">
              <ShopFilters categories={categories} />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <ShopProductList
              products={products}
              categories={categories}
              meta={meta}
              totalProducts={totalProducts}
            />
          </div>
        </div>
      </main>
    </div>
  );
}