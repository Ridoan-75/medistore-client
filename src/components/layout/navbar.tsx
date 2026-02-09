"use client";

import Link from "next/link";
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center gap-4">
          {/* Logo */}
          <img
            href="/"
            src="/images/Logo.png"
            alt="Logo"
            className="h-8 w-auto md:h-10 cursor-pointer"
          />

          {/* Search Bar - Hidden on small mobile */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search medicines, medical products..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Desktop & Tablet */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/wishlist" className="relative hover:text-emerald-600">
              <Heart className="w-6 h-6" />
              <Badge className="absolute -top-2 -right-2 bg-emerald-600 text-xs">
                0
              </Badge>
            </Link>

            <Link href="/cart" className="relative hover:text-emerald-600">
              <ShoppingCart className="w-6 h-6" />
              <Badge className="absolute -top-2 -right-2 bg-emerald-600 text-xs">
                0
              </Badge>
            </Link>

            <Button variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>

            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/wishlist" className="relative">
              <Heart className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 bg-emerald-600 text-[10px]">
                0
              </Badge>
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 bg-emerald-600 text-[10px]">
                0
              </Badge>
            </Link>

            {/* Hamburger */}
            {/* Hamburger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 transition"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[85vw] sm:w-[400px] p-0 
    [&_.absolute.right-4.top-4]:hidden"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b bg-emerald-600 text-white flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Menu</h2>

                  {/* Custom Close Button */}
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-white hover:bg-emerald-700"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </SheetClose>
                </div>

                <div className="p-6 flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>

                    <Button
                      asChild
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </div>

                  <div className="border-t" />

                  <nav className="flex flex-col gap-4">
                    <Link
                      href="/cart"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 font-medium"
                    >
                      <ShoppingCart className="w-5 h-5" /> My Cart
                    </Link>

                    <Link
                      href="/wishlist"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 font-medium"
                    >
                      <Heart className="w-5 h-5" /> Wishlist
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 font-medium"
                    >
                      <ShoppingCart className="w-5 h-5" /> My Orders
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search medicines..." className="pl-10 w-full" />
          </div>
        </div>
      </div>
    </nav>
  );
}
