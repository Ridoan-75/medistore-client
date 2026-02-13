"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Loader2,
  CheckCircle,
  ShoppingBag,
  MapPin,
  Phone,
  Truck,
  CreditCard,
  ArrowLeft,
  Package,
  Sparkles,
  Star,
  Shield,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import {
  selectCartItems,
  selectCartSubtotal,
  clearCart,
  type CartItem,
} from "@/src/store/slices/cartSlice";
import { useToast } from "@/src/hooks/use-toast";
import { createOrderAction } from "@/src/actions/order.action";

type ShippingLocation = "insideDhaka" | "outsideDhaka";

interface FormErrors {
  phone?: string;
  address?: string;
}

interface ShippingOption {
  value: ShippingLocation;
  label: string;
  price: number;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  { value: "insideDhaka", label: "Inside Dhaka", price: 80 },
  { value: "outsideDhaka", label: "Outside Dhaka", price: 160 },
];

const getShippingPrice = (location: ShippingLocation): number => {
  const option = SHIPPING_OPTIONS.find((opt) => opt.value === location);
  return option?.price ?? 80;
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingLocation, setShippingLocation] = useState<ShippingLocation>("insideDhaka");
  const [errors, setErrors] = useState<FormErrors>({});

  const cartItems = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const shipping = getShippingPrice(shippingLocation);
  const total = subtotal + shipping;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && cartItems.length === 0 && !orderSuccess) {
      router.push("/cart");
    }
  }, [mounted, cartItems.length, router, orderSuccess]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (phone.trim().length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }

    if (!shippingAddress.trim()) {
      newErrors.address = "Shipping address is required";
    } else if (shippingAddress.trim().length < 10) {
      newErrors.address = "Please enter a complete address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const orderItems = cartItems.map((item) => ({
      medicineId: item.id,
      quantity: item.quantity,
    }));

    const { data, error } = await createOrderAction({
      phone: phone.trim(),
      shippingAddress: shippingAddress.trim(),
      orderItems,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setOrderId(data.id);
      setOrderSuccess(true);
      dispatch(clearCart());
      toast({
        title: "Order placed successfully!",
        description: `Order ID: ${data.id}`,
      });
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/20 dark:via-slate-900 dark:to-teal-950/20">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 animate-spin" />
            </div>
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-bold text-lg">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/20 dark:via-slate-900 dark:to-teal-950/20">
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-800 rounded-[2rem] p-8 md:p-16 text-center shadow-2xl shadow-emerald-500/10">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-full blur-3xl scale-150 animate-pulse" />
                  <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <CheckCircle className="h-16 w-16 text-white" />
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
                  Order Confirmed!
                </h1>

                <p className="text-slate-600 dark:text-slate-400 text-lg mb-3 font-medium">
                  Thank you for your order. We&apos;ll contact you soon.
                </p>

                {orderId && (
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl mb-10 border-2 border-emerald-200 dark:border-emerald-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-semibold">Order ID:</span>
                    <span className="font-mono font-black text-emerald-700 dark:text-emerald-400 text-lg">{orderId}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200/50 dark:border-emerald-800/50">
                    <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Secure Payment</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200/50 dark:border-emerald-800/50">
                    <Truck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Fast Delivery</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200/50 dark:border-emerald-800/50">
                    <Star className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2 fill-emerald-600 dark:fill-emerald-400" />
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Quality Products</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105 font-semibold text-lg h-14"
                    size="lg"
                  >
                    <Link href="/shop">
                      <Package className="mr-2 h-6 w-6" />
                      Continue Shopping
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold h-14" size="lg">
                    <Link href="/">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/20 dark:via-slate-900 dark:to-teal-950/20">
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 py-8 border-b border-emerald-200/50 dark:border-emerald-800/50">
          <div className="absolute inset-0 backdrop-blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <nav className="flex items-center gap-3 text-sm font-medium">
              <Link href="/" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <Link href="/cart" className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors">
                Cart
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-semibold">Checkout</span>
            </nav>
          </div>
        </div>

        <section className="py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 md:mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                  Secure Checkout
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Complete your order safely
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Delivery Details
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                        <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`h-14 text-base border-2 rounded-xl ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 dark:border-slate-700"}`}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="address" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                        <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Complete Address <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="House/Flat no, Road, Area, City..."
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        rows={5}
                        className={`text-base border-2 rounded-xl resize-none ${errors.address ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 dark:border-slate-700"}`}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">
                        Shipping Method
                      </h2>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">Cash on Delivery</p>
                    </div>
                  </div>

                  <RadioGroup
                    value={shippingLocation}
                    onValueChange={(value) => setShippingLocation(value as ShippingLocation)}
                    className="space-y-4"
                  >
                    {SHIPPING_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                          shippingLocation === option.value
                            ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 shadow-lg shadow-emerald-500/10"
                            : "border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <RadioGroupItem value={option.value} id={`checkout-${option.value}`} className="w-5 h-5" />
                          <Label htmlFor={`checkout-${option.value}`} className="cursor-pointer font-bold text-slate-900 dark:text-white text-base">
                            {option.label}
                          </Label>
                        </div>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-lg">৳{option.price}</span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              <div>
                <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl lg:sticky lg:top-24">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Order Summary
                    </h2>
                  </div>

                  <div className="space-y-4 mb-8 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                    {cartItems.map((item: CartItem) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 hover:shadow-lg transition-all duration-300 border-2 border-slate-200 dark:border-slate-800"
                      >
                        <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800">
                          <Image
                            src={item.imageUrl || "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-900 dark:text-white line-clamp-1 text-base">{item.name}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">Quantity: {item.quantity}</p>
                          <p className="font-black text-emerald-600 dark:text-emerald-400 text-lg">
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 border-t-2 border-slate-200 dark:border-slate-800 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">Subtotal</span>
                      <span className="font-bold text-slate-900 dark:text-white text-lg">৳{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">Shipping</span>
                      <span className="font-bold text-slate-900 dark:text-white text-lg">৳{shipping.toFixed(2)}</span>
                    </div>

                    <div className="border-t-2 border-slate-200 dark:border-slate-800 pt-5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-black text-slate-900 dark:text-white">Total Amount</span>
                        <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">৳{total.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">Cash on Delivery</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mt-8">
                    <Button
                      className="w-full h-16 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105 font-black text-lg rounded-2xl"
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          Processing Order...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-6 w-6" />
                          Confirm Order - ৳{total.toFixed(2)}
                        </>
                      )}
                    </Button>

                    <Button asChild variant="outline" className="w-full h-14 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold rounded-2xl">
                      <Link href="/cart">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back to Cart
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}