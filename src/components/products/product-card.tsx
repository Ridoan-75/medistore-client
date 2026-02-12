"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  ImageIcon,
  Factory,
  Check,
  Sparkles,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useAppDispatch } from "@/src/store/hooks";
import { addToCart } from "@/src/store/slices/cartSlice";
import { useToast } from "@/src/hooks/use-toast";
import { useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
  categoryId: string;
  sellerId: string;
  status: string;
  manufacturer?: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

const NEW_PRODUCT_DAYS = 7;
const LOW_STOCK_THRESHOLD = 20;

const formatCurrency = (price: number): string => {
  return `৳${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
};

const isNewProduct = (createdAt: string): boolean => {
  const createdDate = new Date(createdAt);
  const threshold = new Date(Date.now() - NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000);
  return createdDate > threshold;
};

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const priceNumber = parseFloat(product.price);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
  const isNew = isNewProduct(product.createdAt);
  const isAvailable = product.status === "AVAILABLE" && product.stock > 0;

  // ✅ Check if product is in wishlist on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        const exists = wishlist.some((item: any) => item.id === product.id);
        setIsWishlisted(exists);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    }
  }, [product.id]);

  // ✅ Listen for storage changes from other tabs/components
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        const exists = wishlist.some((item: any) => item.id === product.id);
        setIsWishlisted(exists);
      } catch (error) {
        console.error("Error updating wishlist state:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [product.id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    setIsAddingToCart(true);

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: priceNumber,
        quantity: 1,
        imageUrl: product.imageUrl || "/placeholder.svg",
        stock: product.stock,
        manufacturer: product.manufacturer,
      })
    );

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });

    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

      if (isWishlisted) {
        // ✅ Remove from wishlist
        const filtered = wishlist.filter((item: any) => item.id !== product.id);
        localStorage.setItem("wishlist", JSON.stringify(filtered));
        setIsWishlisted(false);

        toast({
          title: "Removed from wishlist",
          description: `${product.name} removed from your wishlist`,
        });
      } else {
        // ✅ Add to wishlist
        const newItem = {
          id: product.id,
          name: product.name,
          price: priceNumber,
          image: product.imageUrl || "/placeholder.svg",
        };

        wishlist.push(newItem);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        setIsWishlisted(true);

        toast({
          title: "Added to wishlist",
          description: `${product.name} added to your wishlist`,
        });
      }

      // ✅ Trigger storage event for other components
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  if (viewMode === "list") {
    return (
      <div className="group bg-card rounded-2xl overflow-hidden border-2 border-border hover:border-primary/30 hover:shadow-xl transition-all flex">
        <Link
          href={`/product/${product.id}`}
          className="relative w-48 shrink-0 bg-muted overflow-hidden"
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
        </Link>

        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {product.category && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mb-2">
                  {product.category.name}
                </span>
              )}

              <Link href={`/product/${product.id}`}>
                <h3 className="font-bold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h3>
              </Link>

              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {product.description}
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(priceNumber)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {product.stock} in stock
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between">
            {product.manufacturer && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Factory className="h-4 w-4" />
                {product.manufacturer}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleWishlist}
                className={`h-9 w-9 p-0 rounded-xl border-2 ${
                  isWishlisted
                    ? "border-red-500/50 bg-red-500/10 text-red-500"
                    : "hover:border-primary/50"
                }`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500" : ""}`} />
              </Button>

              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                className="h-9 bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
              >
                {isAddingToCart ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <ShoppingCart className="h-4 w-4 mr-2" />
                )}
                {isAddingToCart ? "Added!" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border-2 border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square bg-muted overflow-hidden">
        <Link href={`/product/${product.id}`}>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </Link>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOutOfStock && (
            <Badge
              variant="destructive"
              className="bg-red-500 border-0 shadow-lg flex items-center gap-1"
            >
              <XCircle className="h-3 w-3" />
              Out of Stock
            </Badge>
          )}
          {isNew && !isOutOfStock && (
            <Badge className="bg-gradient-to-r from-primary to-blue-600 border-0 shadow-lg flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              New
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-lg flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Low Stock
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
          <Button
            size="icon"
            variant="secondary"
            onClick={handleWishlist}
            className={`h-9 w-9 rounded-xl shadow-lg backdrop-blur-sm transition-all ${
              isWishlisted
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white/90 hover:bg-white"
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-white" : ""}`} />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            asChild
            className="h-9 w-9 rounded-xl shadow-lg bg-white/90 hover:bg-white backdrop-blur-sm"
          >
            <Link href={`/product/${product.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <Button
            className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-white shadow-lg shadow-primary/30 font-semibold"
            disabled={isOutOfStock || isAddingToCart}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="p-4">
        {product.category && (
          <Link
            href={`/shop?category=${product.category.id}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors mb-3"
          >
            {product.category.name}
          </Link>
        )}

        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-foreground hover:text-primary transition-colors line-clamp-2 mb-2 min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < 4 ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-primary">
              {formatCurrency(priceNumber)}
            </div>
            {product.manufacturer && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Factory className="h-3 w-3" />
                {product.manufacturer}
              </div>
            )}
          </div>

          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isOutOfStock
                ? "bg-red-500/10 text-red-600"
                : isLowStock
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-green-500/10 text-green-600"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOutOfStock ? "bg-red-500" : isLowStock ? "bg-amber-500" : "bg-green-500"
              }`}
            />
            {isOutOfStock ? "Out" : `${product.stock} left`}
          </div>
        </div>
      </div>
    </div>
  );
}