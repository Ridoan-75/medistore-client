"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Slider } from "@/src/components/ui/slider";
import { Label } from "@/src/components/ui/label";
import {
  Search,
  X,
  SlidersHorizontal,
  Tag,
  DollarSign,
  RotateCcw,
  Check,
  Sparkles,
} from "lucide-react";
import { Category } from "@/src/services/category.service";

interface ShopFiltersProps {
  categories: Category[];
  showMobile?: boolean;
  onClose?: () => void;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;
const PRICE_STEP = 10;

export function ShopFilters({
  categories,
  showMobile = false,
  onClose,
}: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("minPrice") || String(DEFAULT_MIN_PRICE);
  const currentMaxPrice = searchParams.get("maxPrice") || String(DEFAULT_MAX_PRICE);

  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [priceRange, setPriceRange] = useState([
    parseInt(currentMinPrice),
    parseInt(currentMaxPrice),
  ]);

  const hasActiveFilters =
    currentSearch ||
    currentCategory ||
    parseInt(currentMinPrice) !== DEFAULT_MIN_PRICE ||
    parseInt(currentMaxPrice) !== DEFAULT_MAX_PRICE;

  const activeFilterCount = [
    currentSearch,
    currentCategory,
    parseInt(currentMinPrice) !== DEFAULT_MIN_PRICE || parseInt(currentMaxPrice) !== DEFAULT_MAX_PRICE,
  ].filter(Boolean).length;

  const updateURL = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== String(DEFAULT_MIN_PRICE) && value !== String(DEFAULT_MAX_PRICE)) {
          newSearchParams.set(key, value);
        } else if (key === "minPrice" || key === "maxPrice") {
          if (
            (key === "minPrice" && value !== String(DEFAULT_MIN_PRICE)) ||
            (key === "maxPrice" && value !== String(DEFAULT_MAX_PRICE))
          ) {
            newSearchParams.set(key, value);
          } else {
            newSearchParams.delete(key);
          }
        } else {
          newSearchParams.delete(key);
        }
      });

      newSearchParams.delete("page");
      router.push(`/shop?${newSearchParams.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = () => {
    updateURL({ search: searchQuery });
  };

  const handleCategoryChange = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? "" : categoryId;
    setSelectedCategory(newCategory);
    updateURL({ category: newCategory });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handlePriceApply = () => {
    updateURL({
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange([DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE]);
    router.push("/shop");
  };

  const filterContent = (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-semibold">
          <Search className="h-4 w-4 text-primary" />
          Search Products
        </Label>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-12 pr-12 rounded-xl border-2 focus:border-primary"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Search"
          >
            <Search className="h-4 w-4 text-primary" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-base font-semibold">
            <Tag className="h-4 w-4 text-primary" />
            Categories
          </Label>
          {categories.length > 0 && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {categories.length}
            </span>
          )}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {category.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-base font-semibold">
          <DollarSign className="h-4 w-4 text-primary" />
          Price Range
        </Label>

        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={DEFAULT_MAX_PRICE}
            min={DEFAULT_MIN_PRICE}
            step={PRICE_STEP}
            className="mb-6"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground mb-1 block">Min</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                ৳
              </span>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="h-10 pl-7 rounded-xl border-2"
              />
            </div>
          </div>
          <div className="text-muted-foreground mt-5">—</div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground mb-1 block">Max</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                ৳
              </span>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])
                }
                className="h-10 pl-7 rounded-xl border-2"
              />
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handlePriceApply}
          className="w-full h-10 border-2 rounded-xl hover:bg-primary/5 hover:border-primary"
        >
          <Check className="h-4 w-4 mr-2" />
          Apply Price Filter
        </Button>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full h-11 border-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive rounded-xl"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  if (showMobile) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Filters</h2>
                {activeFilterCount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {activeFilterCount} active
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-xl hover:bg-destructive/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">{filterContent}</div>

          <div className="p-4 border-t border-border bg-muted/30">
            <Button
              onClick={onClose}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 rounded-xl font-semibold"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Show Results
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
          <SlidersHorizontal className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">Filters</h2>
          {activeFilterCount > 0 && (
            <p className="text-xs text-primary font-medium">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
            </p>
          )}
        </div>
      </div>

      {filterContent}
    </div>
  );
}