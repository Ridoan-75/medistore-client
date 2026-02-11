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
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Shop
            </h1>
            <p className="text-muted-foreground">
              Browse our wide selection of medical supplies and healthcare
              products
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop only */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-4">
                {/* ShopFilters = Client Component (filters UI) */}
                <ShopFilters categories={categories} />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* ShopProductList = Client Component (products grid) */}
              <ShopProductList
                products={products}
                categories={categories}
                meta={meta}
                totalProducts={totalProducts}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
