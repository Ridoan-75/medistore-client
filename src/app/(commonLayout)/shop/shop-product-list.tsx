"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/src/components/products/product-card";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Package,
  ArrowUpDown,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Category } from "@/src/services/category.service";
import { ShopFilters } from "./shop-filters";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface Product {
  id: string;
  name: string;
  price: number | string;
  imageUrl?: string;
  category?: Category;
  stock: number;
  status: string;
}

interface ShopProductListProps {
  products: Product[];
  categories: Category[];
  meta?: PaginationMeta;
  totalProducts: number;
}

type ViewMode = "grid" | "list";
type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

const MAX_VISIBLE_PAGES = 5;

export function ShopProductList({
  products,
  categories,
  meta,
  totalProducts,
}: ShopProductListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  const currentPage = meta?.page || 1;
  const totalPages = meta?.totalPage || 1;
  const displayedProducts = products.length;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    router.push(`/shop?${newSearchParams.toString()}`);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
  };

  const getVisiblePageNumbers = (): number[] => {
    const pages: number[] = [];
    const halfVisible = Math.floor(MAX_VISIBLE_PAGES / 2);

    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

    if (end - start < MAX_VISIBLE_PAGES - 1) {
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePageNumbers();

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl font-semibold px-6 h-11"
              onClick={() => setShowFilters(true)}
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </Button>

            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30 rounded-2xl border-2 border-sky-200 dark:border-sky-800">
                <TrendingUp className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <span className="font-black text-sky-700 dark:text-sky-300 text-base">
                  {displayedProducts}
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-semibold text-sm">of</span>
                <span className="font-black text-sky-700 dark:text-sky-300 text-base">
                  {totalProducts}
                </span>
              </div>
              <span className="text-slate-600 dark:text-slate-400 font-semibold text-sm">products</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[200px] h-12 border-2 border-slate-300 dark:border-slate-700 rounded-2xl font-semibold">
                <ArrowUpDown className="h-5 w-5 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="font-semibold">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex border-2 border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-3 transition-all duration-300",
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                )}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-3 transition-all duration-300 border-l-2 border-slate-300 dark:border-slate-700",
                  viewMode === "list"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                )}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {products.length > 0 ? (
        <div
          className={cn(
            "grid gap-6 lg:gap-8",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-16 text-center shadow-xl">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-400/30 to-slate-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center shadow-2xl">
              <Package className="h-12 w-12 text-slate-600 dark:text-slate-400" />
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">
            No Products Found
          </h3>

          <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-md mx-auto text-lg font-medium">
            We couldn&apos;t find any products matching your search criteria.
            Try adjusting your filters.
          </p>

          <Button
            variant="outline"
            className="border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl font-semibold px-8 h-12"
            onClick={() => router.push("/shop")}
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Clear All Filters
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 p-6 md:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
              Page <span className="font-black text-indigo-700 dark:text-indigo-400 text-base">{currentPage}</span> of{" "}
              <span className="font-black text-indigo-700 dark:text-indigo-400 text-base">{totalPages}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="h-12 px-5 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-all duration-300 hover:scale-105"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </Button>

            <div className="hidden sm:flex items-center gap-2">
              {visiblePages[0] > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className="h-12 w-12 p-0 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl font-bold transition-all duration-300 hover:scale-110"
                  >
                    1
                  </Button>
                  {visiblePages[0] > 2 && (
                    <span className="px-2 text-slate-400 dark:text-slate-600 font-black">...</span>
                  )}
                </>
              )}

              {visiblePages.map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "h-12 w-12 p-0 rounded-2xl font-black transition-all duration-300",
                    currentPage === page
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-500/30 border-0 scale-110"
                      : "border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-110"
                  )}
                >
                  {page}
                </Button>
              ))}

              {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                  {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                    <span className="px-2 text-slate-400 dark:text-slate-600 font-black">...</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    className="h-12 w-12 p-0 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl font-bold transition-all duration-300 hover:scale-110"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <div className="sm:hidden">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                <span className="font-black text-slate-900 dark:text-white text-base">
                  {currentPage}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-bold">/</span>
                <span className="font-black text-slate-900 dark:text-white text-base">
                  {totalPages}
                </span>
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="h-12 px-5 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-all duration-300 hover:scale-105"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {showFilters && (
        <ShopFilters
          categories={categories}
          showMobile={true}
          onClose={() => setShowFilters(false)}
        />
      )}
    </>
  );
}