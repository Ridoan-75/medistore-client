"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Loader2,
  ShieldCheck,
  Store,
  LogOut,
  LayoutDashboard,
  UserCircle,
  Package,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { onAuthChange, logout } from "@/src/lib/auth";
import { toast } from "@/src/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

interface CartItem {
  quantity?: number;
}

interface WishlistItem {
  id?: string;
}

interface FirebaseUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  getIdToken: () => Promise<string>;
}

interface User {
  id: string;
  email?: string;
  name?: string;
  role?: "ADMIN" | "SELLER" | "CUSTOMER";
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const syncCounts = () => {
    try {
      const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      const wishlist: WishlistItem[] = JSON.parse(localStorage.getItem("wishlist") || "[]");

      setCartCount(
        Array.isArray(cart)
          ? cart.reduce((acc, item) => acc + (item.quantity || 1), 0)
          : 0
      );

      setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
    } catch {
      setCartCount(0);
      setWishlistCount(0);
    }
  };

  const fetchUserFromDB = async (firebaseUser: FirebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data: { name?: string; role?: "ADMIN" | "SELLER" | "CUSTOMER" } =
          await res.json();

        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email ?? undefined,
          name: firebaseUser.displayName ?? data.name ?? undefined,
          role: data.role ?? "CUSTOMER",
        });
      } else {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email ?? undefined,
          name: firebaseUser.displayName ?? undefined,
          role: "CUSTOMER",
        });
      }
    } catch {
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email ?? undefined,
        name: firebaseUser.displayName ?? undefined,
        role: "CUSTOMER",
      });
    }
  };

  useEffect(() => {
    syncCounts();

    const unsubscribe = onAuthChange(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setIsLoggedIn(true);
        await fetchUserFromDB(firebaseUser);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setIsLoading(false);
    });

    const handleCartUpdate = () => syncCounts();
    const handleWishlistUpdate = () => syncCounts();

    window.addEventListener("cart-updated", handleCartUpdate);
    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    window.addEventListener("storage", syncCounts);

    return () => {
      unsubscribe();
      window.removeEventListener("cart-updated", handleCartUpdate);
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
      window.removeEventListener("storage", syncCounts);
    };
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query?.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsLoggedIn(false);
      setUser(null);

      toast({
        title: "Logged out successfully",
        description: "See you again soon!",
      });

      router.push("/");
      router.refresh();
    } catch {
      toast({
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getRoleStyle = () => {
    if (user?.role === "ADMIN") {
      return {
        icon: ShieldCheck,
        color: "text-red-600",
        bgColor: "bg-red-50",
        hoverBg: "hover:bg-red-100",
        label: "Admin",
      };
    }
    if (user?.role === "SELLER") {
      return {
        icon: Store,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        hoverBg: "hover:bg-blue-100",
        label: "Seller",
      };
    }
    return {
      icon: UserCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      hoverBg: "hover:bg-emerald-100",
      label: "Customer",
    };
  };

  const getDashboardLink = () => {
    if (user?.role === "ADMIN") return "/admin-dashboard";
    if (user?.role === "SELLER") return "/seller-dashboard";
    return null;
  };

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const roleStyle = getRoleStyle();
  const RoleIcon = roleStyle.icon;
  const isCustomer = isLoggedIn && user?.role === "CUSTOMER";

  return (
    <header className="w-full border-b bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/images/Logo.png" alt="Logo" width={100} height={100} className="h-10 w-auto" />
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl border-2 rounded-xl overflow-hidden border-gray-200 dark:border-gray-700">
          <Input name="search" placeholder="Search medicine..." className="border-0 h-11" />
          <Button type="submit" className="bg-emerald-600 px-6 h-11">
            <Search className="h-5 w-5 text-white" />
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <Link href="/wishlist" className="p-2">
            <Heart className="h-5 w-5" />
          </Link>

          <Link href="/cart" className="p-2">
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`p-2 rounded-lg ${roleStyle.bgColor}`}>
                  <RoleIcon className={`h-5 w-5 ${roleStyle.color}`} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <RoleIcon className={`h-5 w-5 ${roleStyle.color}`} />
                    <div>
                      <p className="text-sm font-semibold">{user?.name || user?.email}</p>
                      <p className={`text-xs ${roleStyle.color}`}>{roleStyle.label}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {getDashboardLink() && (
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()!}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Button asChild className="bg-emerald-600 text-white">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-emerald-600 text-white">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}