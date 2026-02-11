"use client";

import Link from "next/link";
import { ShoppingCart, ChevronRight, Package, Sparkles, Trash2, ArrowLeft, ShoppingBag, Zap, Lock } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import { CartItemCard } from "@/src/components/cart/CartItemCard";
import { CartSummary } from "@/src/components/cart/CartSummary";
import { selectCartItems, clearCart, type CartItem } from "@/src/store/slices/cartSlice";

interface EmptyCartFeature {
  title: string;
  description: string;
}

const EMPTY_CART_FEATURES: EmptyCartFeature[] = [
  { title: "Browse Products", description: "Explore our wide range" },
  { title: "Quality Assured", description: "100% authentic items" },
  { title: "Fast Delivery", description: "Quick shipping nationwide" },
];

export default function CartPage() {
  const cartItems = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();

  const itemCount = cartItems.length;
  const itemText = itemCount === 1 ? "Item" : "Items";
  const productText = itemCount === 1 ? "product" : "products";

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30">
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 py-8 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="absolute inset-0 backdrop-blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <nav className="flex items-center gap-3 text-sm font-medium mb-4">
              <Link
                href="/"
                className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-semibold">Shopping Cart</span>
            </nav>
          </div>
        </div>

        <section className="py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 md:mb-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-violet-500/20 backdrop-blur-xl rounded-full border border-blue-500/30 shadow-lg shadow-blue-500/10">
                  <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm tracking-wide">
                    {itemCount} {itemText}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                  Your Cart
                </h1>
              </div>

              {itemCount > 0 && (
                <Button
                  variant="outline"
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 border-2 border-red-200 dark:border-red-900 hover:border-red-400 dark:hover:border-red-600 font-semibold transition-all duration-300 hover:scale-105"
                  onClick={handleClearCart}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>

            {itemCount === 0 ? (
              <div className="text-center py-12 md:py-20 lg:py-28">
                <div className="relative inline-block mb-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-violet-500/30 rounded-full blur-3xl scale-150 animate-pulse" />
                  <div className="relative w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-full flex items-center justify-center border-4 border-blue-500/20 shadow-2xl">
                    <ShoppingCart className="h-20 w-20 md:h-24 md:w-24 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
                  Cart is Empty
                </h2>

                <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl mb-10 max-w-md mx-auto font-medium">
                  Ready to start shopping? Explore our collection now!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 font-semibold px-8">
                    <Link href="/shop">
                      <Package className="mr-2 h-5 w-5" />
                      Explore Products
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
                  {EMPTY_CART_FEATURES.map((feature, index) => (
                    <div
                      key={feature.title}
                      className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${
                        index === 0 ? 'from-blue-400 to-cyan-600' :
                        index === 1 ? 'from-emerald-400 to-teal-600' :
                        'from-violet-400 to-purple-600'
                      } rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        {index === 0 ? <Package className="h-6 w-6 text-white" /> :
                         index === 1 ? <Lock className="h-6 w-6 text-white" /> :
                         <Zap className="h-6 w-6 text-white" />}
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20 border-2 border-blue-200/50 dark:border-blue-800/50">
                    <p className="text-slate-700 dark:text-slate-300 font-bold text-lg">
                      {itemCount} {productText} ready for checkout
                    </p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full border border-emerald-500/30 shadow-lg">
                      <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                        All Set!
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {cartItems.map((item: CartItem) => (
                      <CartItemCard key={item.id} item={item} />
                    ))}
                  </div>

                  <div className="pt-6">
                    <Button asChild variant="outline" className="w-full sm:w-auto border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold px-8">
                      <Link href="/shop">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Keep Shopping
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="lg:sticky lg:top-24 h-fit">
                  <CartSummary />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}