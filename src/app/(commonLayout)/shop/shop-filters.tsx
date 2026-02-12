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
  Filter,
  Zap,
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
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <Search className="h-5 w-5 text-white" />
          </div>
          <Label className="text-base font-black text-slate-900 dark:text-white">
            Search Products
          </Label>
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-14 pr-14 rounded-2xl border-2 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 text-base font-medium"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:scale-105"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Tag className="h-5 w-5 text-white" />
            </div>
            <Label className="text-base font-black text-slate-900 dark:text-white">
              Categories
            </Label>
          </div>
          {categories.length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-black text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 px-3 py-1.5 rounded-full border border-violet-200 dark:border-violet-800">
              <Sparkles className="h-3 w-3" />
              {categories.length}
            </span>
          )}
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`group w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${
                  isSelected
                    ? "border-violet-500 dark:border-violet-500 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 shadow-lg shadow-violet-500/10"
                    : "border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "border-violet-500 bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg scale-110"
                        : "border-slate-400 dark:border-slate-600 group-hover:border-violet-400 dark:group-hover:border-violet-600"
                    }`}
                  >
                    {isSelected && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <span
                    className={`text-base font-bold transition-colors ${
                      isSelected 
                        ? "text-violet-700 dark:text-violet-400" 
                        : "text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400"
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

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <Label className="text-base font-black text-slate-900 dark:text-white">
            Price Range
          </Label>
        </div>

        <div className="px-3">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={DEFAULT_MAX_PRICE}
            min={DEFAULT_MIN_PRICE}
            step={PRICE_STEP}
            className="mb-8"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 block">MINIMUM</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 font-bold">
                ৳
              </span>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="h-12 pl-8 rounded-xl border-2 border-slate-300 dark:border-slate-700 font-bold text-base"
              />
            </div>
          </div>
          <div className="text-slate-400 dark:text-slate-600 mt-6 font-black text-xl">—</div>
          <div className="flex-1">
            <Label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 block">MAXIMUM</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 font-bold">
                ৳
              </span>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])
                }
                className="h-12 pl-8 rounded-xl border-2 border-slate-300 dark:border-slate-700 font-bold text-base"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handlePriceApply}
          className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 rounded-xl font-bold transition-all duration-300 hover:scale-105"
        >
          <Check className="h-5 w-5 mr-2" />
          Apply Price Filter
        </Button>
      </div>

      {hasActiveFilters && (
        <Button
          onClick={clearFilters}
          className="w-full h-12 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-2 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-100 hover:to-rose-100 dark:hover:from-red-950/50 dark:hover:to-rose-950/50 hover:border-red-400 dark:hover:border-red-700 rounded-xl font-black transition-all duration-300 hover:scale-105"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  if (showMobile) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />

        <div className="absolute right-0 top-0 h-full w-96 max-w-[90vw] bg-white dark:bg-slate-950 shadow-2xl overflow-hidden flex flex-col border-l-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between p-6 border-b-2 border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <SlidersHorizontal className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 dark:text-white text-lg">Filters</h2>
                {activeFilterCount > 0 && (
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {activeFilterCount} active
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 h-12 w-12"
            >
              <X className="h-6 w-6 text-red-600 dark:text-red-400" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">{filterContent}</div>

          <div className="p-6 border-t-2 border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <Button
              onClick={onClose}
              className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-2xl shadow-indigo-500/30 rounded-2xl font-black text-base transition-all duration-300 hover:scale-105"
            >
              <Zap className="h-5 w-5 mr-2" />
              Show Results
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
          <Filter className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="font-black text-slate-900 dark:text-white text-xl">Filters</h2>
          {activeFilterCount > 0 && (
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
            </p>
          )}
        </div>
      </div>

      {filterContent}
    </div>
  );
}