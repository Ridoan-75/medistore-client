"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ImageIcon, Factory, ExternalLink } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useAppDispatch } from "@/src/store/hooks";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "@/src/store/slices/cartSlice";
import { CartItem } from "@/src/types/cart.types";

interface CartItemCardProps {
  item: CartItem;
}

const formatCurrency = (amount: number): string => {
  return `৳${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
};

export function CartItemCard({ item }: CartItemCardProps) {
  const dispatch = useAppDispatch();

  const subtotal = item.price * item.quantity;
  const isMinQuantity = item.quantity <= 1;
  const isMaxQuantity = item.quantity >= item.stock;
  const isLowStock = item.stock <= 5 && item.stock > 0;

  const handleIncrement = () => {
    if (!isMaxQuantity) {
      dispatch(incrementQuantity(item.id));
    }
  };

  const handleDecrement = () => {
    if (!isMinQuantity) {
      dispatch(decrementQuantity(item.id));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  return (
    <div className="group flex gap-4 p-4 md:p-5 bg-card rounded-2xl border-2 border-border hover:border-primary/20 hover:shadow-lg transition-all">
      <Link
        href={`/product/${item.id}`}
        className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden border-2 border-border bg-muted group-hover:border-primary/30 transition-colors"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <Link
            href={`/product/${item.id}`}
            className="inline-flex items-center gap-1 group/link"
          >
            <h3 className="font-semibold text-foreground group-hover/link:text-primary transition-colors line-clamp-1">
              {item.name}
            </h3>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </Link>

          {item.manufacturer && (
            <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
              <Factory className="h-3.5 w-3.5" />
              <span>{item.manufacturer}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(item.price)}
          </span>

          {isLowStock && (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded-full">
              Only {item.stock} left
            </span>
          )}
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-center justify-center">
        <div className="flex items-center border-2 border-border rounded-xl overflow-hidden bg-muted/30">
          <button
            onClick={handleDecrement}
            disabled={isMinQuantity}
            className="p-2.5 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="px-4 py-2 font-bold text-lg min-w-[50px] text-center bg-background">
            {item.quantity}
          </span>

          <button
            onClick={handleIncrement}
            disabled={isMaxQuantity}
            className="p-2.5 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between py-1">
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-0.5">Subtotal</p>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(subtotal)}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 border-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive transition-all"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          <span className="hidden md:inline">Remove</span>
        </Button>
      </div>

      <div className="sm:hidden absolute bottom-4 right-4">
        <div className="flex items-center border-2 border-border rounded-lg overflow-hidden bg-muted/30">
          <button
            onClick={handleDecrement}
            disabled={isMinQuantity}
            className="p-2 hover:bg-muted disabled:opacity-40 transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="px-3 py-1.5 font-bold text-sm bg-background">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={isMaxQuantity}
            className="p-2 hover:bg-muted disabled:opacity-40 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}