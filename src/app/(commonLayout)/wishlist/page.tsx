"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ChevronRight, ShoppingCart, Trash2, ArrowLeft, Package, Star, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useAppDispatch } from "@/src/store/hooks";
import { addToCart } from "@/src/store/slices/cartSlice";
import Image from "next/image";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  manufacturer?: string;
}

interface EmptyWishlistFeature {
  title: string;
  description: string;
}

const EMPTY_WISHLIST_FEATURES: EmptyWishlistFeature[] = [
  { title: "Save Favorites", description: "Keep track of items you love" },
  { title: "Price Alerts", description: "Get notified on price drops" },
  { title: "Quick Access", description: "Shop your favorites anytime" },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    // Initialize state from localStorage during first render
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        try {
          return JSON.parse(savedWishlist);
        } catch (error) {
          console.error("Error loading wishlist:", error);
        }
      }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only sync to localStorage when wishlistItems changes
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const itemCount = wishlistItems.length;
  const itemText = itemCount === 1 ? "Item" : "Items";

  const handleRemoveItem = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearWishlist = () => {
    setWishlistItems([]);
  };

  const handleMoveToCart = (item: WishlistItem) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.image,
      quantity: 1,
      stock: item.stock,
      manufacturer: item.manufacturer,
    }));
    handleRemoveItem(item.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-white to-pink-50/30 dark:from-rose-950/20 dark:via-slate-900 dark:to-pink-950/20">
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-fuchsia-500/10 py-8 border-b border-rose-200/50 dark:border-rose-800/50">
          <div className="absolute inset-0 backdrop-blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <nav className="flex items-center gap-3 text-sm font-medium mb-4">
              <Link
                href="/"
                className="text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-semibold">Wishlist</span>
            </nav>
          </div>
        </div>

        <section className="py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 md:mb-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500/20 to-pink-500/20 backdrop-blur-xl rounded-full border border-rose-500/30 shadow-lg shadow-rose-500/10">
                  <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400 fill-rose-600 dark:fill-rose-400" />
                  <span className="text-rose-700 dark:text-rose-300 font-semibold text-sm tracking-wide">
                    {itemCount} {itemText}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                  My Wishlist
                </h1>
              </div>

              {itemCount > 0 && (
                <Button
                  variant="outline"
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 border-2 border-red-200 dark:border-red-900 hover:border-red-400 dark:hover:border-red-600 font-semibold transition-all duration-300 hover:scale-105"
                  onClick={handleClearWishlist}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>

            {itemCount === 0 ? (
              <div className="text-center py-12 md:py-20 lg:py-28">
                <div className="relative inline-block mb-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 to-pink-500/30 rounded-full blur-3xl scale-150 animate-pulse" />
                  <div className="relative w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-full flex items-center justify-center border-4 border-rose-500/20 shadow-2xl">
                    <Heart className="h-20 w-20 md:h-24 md:w-24 text-rose-600 dark:text-rose-400" />
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
                  No Favorites Yet
                </h2>

                <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl mb-10 max-w-md mx-auto font-medium">
                  Start adding items you love to your wishlist!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild size="lg" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-2xl shadow-rose-500/30 transition-all duration-300 hover:scale-105 font-semibold px-8">
                    <Link href="/shop">
                      <Package className="mr-2 h-5 w-5" />
                      Browse Products
                    </Link>
                  </Button>

                  <Button asChild size="lg" variant="outline" className="border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold px-8">
                    <Link href="/">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Go Home
                    </Link>
                  </Button>
                </div>

                <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {EMPTY_WISHLIST_FEATURES.map((feature, index) => (
                    <div
                      key={feature.title}
                      className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-rose-500/10 hover:border-rose-500/50 transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${
                        index === 0 ? 'from-rose-400 to-pink-600' :
                        index === 1 ? 'from-orange-400 to-amber-600' :
                        'from-fuchsia-400 to-purple-600'
                      } rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        {index === 0 ? <Heart className="h-6 w-6 text-white fill-white" /> :
                         index === 1 ? <TrendingUp className="h-6 w-6 text-white" /> :
                         <Star className="h-6 w-6 text-white fill-white" />}
                      </div>
                      <h3 className="font-black text-slate-900 dark:text-white mb-2 text-lg">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-2 border-rose-200/50 dark:border-rose-800/50">
                  <p className="text-slate-700 dark:text-slate-300 font-bold text-lg">
                    {itemCount} saved {itemText.toLowerCase()}
                  </p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-full border border-rose-500/30 shadow-lg">
                    <Sparkles className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    <span className="text-sm font-bold text-rose-700 dark:text-rose-300">
                      Your Favorites
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {wishlistItems.map((item) => (
                    <article
                      key={item.id}
                      className="group relative bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-2xl hover:shadow-rose-500/10 hover:border-rose-500/50 transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className="absolute top-4 right-4 z-10">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-rose-200 dark:border-rose-800 hover:bg-red-50 dark:hover:bg-red-950/50 hover:border-red-500 transition-all duration-300 shadow-lg hover:scale-110"
                          aria-label="Remove from wishlist"
                        >
                          <Heart className="h-5 w-5 text-rose-600 dark:text-rose-400 fill-rose-600 dark:fill-rose-400" />
                        </button>
                      </div>

                      <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-black text-slate-900 dark:text-white text-lg line-clamp-2 min-h-[3.5rem]">
                          {item.name}
                        </h3>

                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
                            ${item.price.toFixed(2)}
                          </p>
                          
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                                ${item.originalPrice.toFixed(2)}
                              </span>
                              <span className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-full">
                                SALE
                              </span>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => handleMoveToCart(item)}
                          className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:scale-105 font-semibold"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="pt-6 flex justify-center">
                  <Button asChild variant="outline" className="border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold px-8">
                    <Link href="/shop">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}