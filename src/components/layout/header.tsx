"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Search, Heart, ShoppingCart, User, Menu, X, Loader2, ShieldCheck, Store, LogOut, LayoutDashboard } from "lucide-react";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/use-auth";
import { authClient } from "@/src/lib/auth-client";
import { toast } from "@/src/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  
  // ✅ Real auth check
  const { isLoggedIn, isLoading, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ✅ Search Handler
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;

    if (query?.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  // ✅ Logout Handler
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      localStorage.removeItem('medistore_user');
      
      toast({
        title: "Logged out successfully",
        description: "See you again soon!",
      });
      
      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ✅ Get role icon
  const getRoleIcon = () => {
    if (user?.role === "ADMIN") {
      return <ShieldCheck className="h-5 w-5 text-red-600" />;
    } else if (user?.role === "SELLER") {
      return <Store className="h-5 w-5 text-blue-600" />;
    }
    return <User className="h-5 w-5 text-green-600" />;
  };

  // ✅ Get dashboard link based on role
  const getDashboardLink = () => {
    if (user?.role === "ADMIN") return "/admin-dashboard";
    if (user?.role === "SELLER") return "/seller-dashboard";
    return null;
  };

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50 shadow-sm">
      {/* ================= TOP NAV ================= */}
      <div className="container mx-auto flex items-center justify-between py-4 px-4 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/Logo.png"
            alt="MediStore Logo"
            width={100}
            height={100}
            className="w-auto h-10"
          />
        </Link>

        {/* ✅ Search Bar Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl border-2 rounded-xl overflow-hidden border-gray-200 focus-within:border-green-600 transition-colors"
        >
          <Input
            name="search"
            placeholder="Search medicine, medical products..."
            className="border-0 focus-visible:ring-0 h-11"
          />

          <Button
            type="submit"
            className="rounded-none bg-green-600 hover:bg-green-700 px-6 h-11"
          >
            <Search className="h-5 w-5 text-white" />
          </Button>
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <Link 
            href="/wishlist" 
            className="hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>

          {/* Cart */}
          <Link 
            href="/cart" 
            className="hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50 relative"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {/* ✅ Profile Icon OR Sign In/Sign Up Buttons */}
          {isLoading ? (
            <div className="p-2">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : isLoggedIn ? (
            // ✅ Logged In - Show Profile Icon with Dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="hover:bg-green-50 transition-colors p-2 rounded-lg flex items-center gap-2"
                  aria-label="Profile Menu"
                >
                  {getRoleIcon()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* ✅ Dashboard Button - Only for Admin/Seller */}
                {(user?.role === "ADMIN" || user?.role === "SELLER") && getDashboardLink() && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()!} className="cursor-pointer">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                {/* ✅ Logout Button */}
                <DropdownMenuItem 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // ✅ Not Logged In - Show Sign In/Sign Up Buttons
            <div className="hidden sm:flex gap-2">
              <Button 
                asChild 
                variant="ghost" 
                className="font-semibold text-sm hover:text-green-600"
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button 
                asChild 
                className="font-semibold text-sm bg-green-600 hover:bg-green-700"
              >
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* ✅ Search Bar Mobile */}
      <div className="px-4 pb-3 md:hidden">
        <form
          onSubmit={handleSearch}
          className="flex border-2 rounded-xl overflow-hidden border-gray-200 focus-within:border-green-600"
        >
          <Input
            name="search"
            placeholder="Search medicine..."
            className="border-0 focus-visible:ring-0 h-10"
          />
          <Button 
            type="submit" 
            className="rounded-none bg-green-600 hover:bg-green-700 px-5 h-10"
          >
            <Search className="h-4 w-4 text-white" />
          </Button>
        </form>
      </div>

      {/* ================= NAV LINKS ================= */}
      <nav className="border-t">
        <div className="container mx-auto px-4">
          {/* Desktop Menu */}
          <ul className="hidden md:flex justify-center items-center gap-8 text-sm font-semibold py-3">
            <li>
              <Link href="/" className="hover:text-green-600 transition-colors py-2 px-3 rounded-lg hover:bg-green-50">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-green-600 transition-colors py-2 px-3 rounded-lg hover:bg-green-50">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-green-600 transition-colors py-2 px-3 rounded-lg hover:bg-green-50">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-green-600 transition-colors py-2 px-3 rounded-lg hover:bg-green-50">
                Contact
              </Link>
            </li>
          </ul>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <ul className="flex flex-col gap-2 py-4 md:hidden text-sm font-semibold border-t">
              <li>
                <Link 
                  href="/" 
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/shop" 
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  Contact
                </Link>
              </li>

              {/* ✅ Mobile - Not Logged In - Sign In/Sign Up Buttons */}
              {!isLoading && !isLoggedIn && (
                <div className="flex flex-col gap-2 pt-2 border-t mt-2">
                  <Button 
                    asChild 
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/login" onClick={() => setMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    className="w-full justify-start bg-green-600 hover:bg-green-700"
                  >
                    <Link href="/register" onClick={() => setMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}

              {/* ✅ Mobile - Logged In - Show Email, Dashboard (if admin/seller), Logout */}
              {!isLoading && isLoggedIn && (
                <div className="pt-2 border-t mt-2 space-y-2">
                  {/* Email Display */}
                  <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-50">
                    {getRoleIcon()}
                    <div>
                      <p className="text-xs text-gray-500">Logged in as</p>
                      <p className="font-semibold text-sm">{user?.email}</p>
                    </div>
                  </div>

                  {/* ✅ Dashboard Button - Only for Admin/Seller */}
                  {(user?.role === "ADMIN" || user?.role === "SELLER") && getDashboardLink() && (
                    <Link 
                      href={getDashboardLink()!}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  {/* ✅ Logout Button */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              )}
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}