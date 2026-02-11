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
      <div className="bg-card border border-border rounded-2xl p-4 md:p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden border-2 rounded-xl"
              onClick={() => setShowFilters(true)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-foreground">
                {displayedProducts}
              </span>
              <span className="text-muted-foreground">of</span>
              <span className="font-semibold text-foreground">
                {totalProducts}
              </span>
              <span className="text-muted-foreground">products</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] h-10 border-2 rounded-xl">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex border-2 border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2.5 transition-colors",
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "bg-background hover:bg-muted"
                )}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2.5 transition-colors border-l-2 border-border",
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "bg-background hover:bg-muted"
                )}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {products.length > 0 ? (
        <div
          className={cn(
            "grid gap-6",
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
        <div className="bg-card border-2 border-dashed border-border rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">
            No Products Found
          </h3>

          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We couldn&apos;t find any products matching your search criteria.
            Try adjusting your filters.
          </p>

          <Button
            variant="outline"
            className="border-2 rounded-xl"
            onClick={() => router.push("/shop")}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 p-4 bg-card border border-border rounded-2xl">
          <div className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="h-10 px-3 border-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="hidden sm:flex items-center gap-1">
              {visiblePages[0] > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className="h-10 w-10 p-0 border-2 rounded-xl"
                  >
                    1
                  </Button>
                  {visiblePages[0] > 2 && (
                    <span className="px-2 text-muted-foreground">...</span>
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
                    "h-10 w-10 p-0 rounded-xl",
                    currentPage === page
                      ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 border-0"
                      : "border-2 hover:border-primary/50"
                  )}
                >
                  {page}
                </Button>
              ))}

              {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                  {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                    <span className="px-2 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    className="h-10 w-10 p-0 border-2 rounded-xl"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <div className="sm:hidden">
              <span className="text-sm font-medium text-foreground px-3">
                {currentPage} / {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="h-10 px-3 border-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
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