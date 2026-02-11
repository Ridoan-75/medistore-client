"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Heart, ShoppingCart, Share2, Minus, Plus, Check } from "lucide-react";
import { useAppDispatch } from "@/src/store/hooks";
import { addToCart } from "@/src/store/slices/cartSlice";
import { useToast } from "@/src/hooks/use-toast";

interface ProductQuantitySelectorProps {
  productId: string;
  productName: string;
  price: number;
  imageUrl: string;
  stock: number;
  manufacturer?: string;
}

export function ProductQuantitySelector({
  productId,
  productName,
  price,
  imageUrl,
  stock,
  manufacturer,
}: ProductQuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const isOutOfStock = stock === 0;
  const isMinQuantity = quantity <= 1;
  const isMaxQuantity = quantity >= stock;

  const handleIncrement = () => {
    if (!isMaxQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (!isMinQuantity) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: productId,
        name: productName,
        price,
        quantity,
        imageUrl,
        stock,
        manufacturer,
      })
    );

    setIsAdded(true);

    toast({
      title: "Added to cart",
      description: `${quantity} × ${productName} added to your cart`,
    });

    setTimeout(() => {
      setIsAdded(false);
      setQuantity(1);
    }, 1500);
  };

  const handleWishlist = () => {
    setIsWishlisted((prev) => !prev);

    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted
        ? `${productName} removed from your wishlist`
        : `${productName} added to your wishlist`,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: productName,
      text: `Check out ${productName} on MediStore!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Product link copied to clipboard",
        });
      }
    } catch {
      toast({
        title: "Share failed",
        description: "Unable to share this product",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="inline-flex items-center border-2 border-border rounded-xl overflow-hidden bg-muted/30">
          <button
            onClick={handleDecrement}
            disabled={isMinQuantity || isOutOfStock}
            className="p-3.5 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="px-6 py-3 font-bold text-lg min-w-[60px] text-center bg-background">
            {quantity}
          </span>

          <button
            onClick={handleIncrement}
            disabled={isMaxQuantity || isOutOfStock}
            className="p-3.5 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdded}
          className={`flex-1 h-12 text-base font-semibold gap-2 shadow-lg transition-all ${
            isAdded
              ? "bg-green-500 hover:bg-green-500 shadow-green-500/25"
              : "bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 shadow-primary/25"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="h-5 w-5" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </>
          )}
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleWishlist}
          className={`flex-1 sm:flex-none h-12 border-2 gap-2 transition-all ${
            isWishlisted
              ? "border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/20"
              : "hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          <Heart
            className={`h-5 w-5 transition-all ${
              isWishlisted ? "fill-red-500 text-red-500" : ""
            }`}
          />
          <span className="sm:hidden lg:inline">
            {isWishlisted ? "Wishlisted" : "Wishlist"}
          </span>
        </Button>

        <Button
          variant="outline"
          onClick={handleShare}
          className="flex-1 sm:flex-none h-12 border-2 gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <Share2 className="h-5 w-5" />
          <span className="sm:hidden lg:inline">Share</span>
        </Button>
      </div>

      {!isOutOfStock && stock <= 10 && (
        <p className="text-sm text-amber-600 dark:text-amber-400 font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          Only {stock} left in stock - order soon!
        </p>
      )}
    </div>
  );
}