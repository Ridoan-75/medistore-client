"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Phone,
  Mail,
  Heart,
  LogOut,
  ChevronDown,
  Package,
  Settings,
  LayoutDashboard,
  ShieldCheck,
  MapPin,
  Loader2,
} from "lucide-react";
import { useAppSelector } from "@/src/store/hooks";
import { selectCartTotalQuantity } from "@/src/store/slices/cartSlice";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/src/components/ui/dropdown-menu";
import { Roles } from "@/src/constants/roles";
import { authClient } from "@/src/lib/auth-client";
import { useToast } from "@/src/hooks/use-toast";

interface HeaderProps {
  userRole?: string;
}

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const MOBILE_LINKS: NavLink[] = [
  ...NAV_LINKS,
  { label: "Medical Supplies", href: "/shop?category=medical" },
  { label: "Personal Care", href: "/shop?category=personal" },
  { label: "Track Order", href: "/orders/track" },
];

export function Header({ userRole }: HeaderProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const cartTotalQuantity = useAppSelector(selectCartTotalQuantity);
  const cartCount = mounted ? cartTotalQuantity : 0;

  const isLoggedIn = !!userRole;
  const isAdmin = userRole === Roles.ADMIN;
  const isSeller = userRole === Roles.SELLER;
  const shouldShowDashboard = isAdmin || isSeller;
  const dashboardUrl = isAdmin ? "/admin-dashboard" : "/seller-dashboard";
  const roleLabel = isAdmin ? "Admin" : isSeller ? "Seller" : "Customer";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query?.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-50">
      <div className="bg-gradient-to-r from-primary via-primary to-blue-600 text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <Link
              href="tel:+880123456789"
              className="flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">(+880) 123-4567</span>
            </Link>
            <Link
              href="mailto:support@medistore.com"
              className="hidden md:flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>support@medistore.com</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/orders/track"
              className="hidden sm:flex items-center gap-1.5 hover:text-white/80 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span>Track Order</span>
            </Link>

            {isLoggedIn ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                <ShieldCheck className="h-3 w-3" />
                {roleLabel}
              </span>
            ) : (
              <Link href="/login" className="hover:text-white/80 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      <div
        className={`bg-card border-b border-border py-4 px-4 transition-shadow ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              MediStore
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                name="search"
                placeholder="Search for medicines, healthcare products..."
                className="w-full h-11 pl-5 pr-14 rounded-full border-2 border-primary/20 focus:border-primary bg-muted/30"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 shadow-lg shadow-primary/25"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hidden sm:flex relative h-10 w-10 rounded-xl hover:bg-muted"
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex h-10 w-10 rounded-xl hover:bg-muted"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">My Account</p>
                        <p className="text-xs text-muted-foreground">{roleLabel}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {shouldShowDashboard && (
                      <DropdownMenuItem asChild>
                        <Link href={dashboardUrl} className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/wishlist" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      {isLoggingOut ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4 mr-2" />
                      )}
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Welcome to MediStore</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Create Account
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-xl hover:bg-muted"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10 rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <nav className="bg-card border-b border-border hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 py-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-4 py-2.5 font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all inline-block"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {shouldShowDashboard && (
              <li>
                <Link
                  href={dashboardUrl}
                  className="px-4 py-2.5 font-medium text-primary hover:bg-primary/10 rounded-lg transition-all inline-flex items-center gap-1.5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </li>
            )}

            <li className="ml-auto">
              <Link
                href="/orders/track"
                className="px-4 py-2.5 font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-all inline-flex items-center gap-1.5"
              >
                <MapPin className="h-4 w-4" />
                Track Order
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Input
                type="text"
                name="search"
                placeholder="Search products..."
                className="w-full h-11 pl-5 pr-14 rounded-full border-2 border-primary/20"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-gradient-to-r from-primary to-blue-600"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <ul className="space-y-1">
              {MOBILE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-3 font-medium text-foreground hover:text-primary hover:bg-muted rounded-xl transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {shouldShowDashboard && (
                <li>
                  <Link
                    href={dashboardUrl}
                    className="block px-4 py-3 font-medium text-primary bg-primary/10 rounded-xl"
                    onClick={closeMobileMenu}
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </span>
                  </Link>
                </li>
              )}

              <li className="pt-2 border-t border-border mt-2">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    disabled={isLoggingOut}
                    className="w-full px-4 py-3 font-medium text-destructive hover:bg-destructive/10 rounded-xl text-left flex items-center gap-2"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-3 font-medium text-primary hover:bg-primary/10 rounded-xl"
                    onClick={closeMobileMenu}
                  >
                    Sign In / Register
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}