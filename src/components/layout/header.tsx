"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Search, Heart, ShoppingCart, Menu, X, Loader2, ShieldCheck, Store, LogOut, LayoutDashboard, UserCircle } from "lucide-react";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
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

// Types for user data
interface User {
  id: string;
  email?: string;
  name?: string;
  role?: "ADMIN" | "SELLER" | "CUSTOMER";
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  
  // Auth state management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check auth status with localStorage fallback
  const checkAuthStatus = async () => {
    try {
      const { data } = await authClient.getSession();
      
      if (data?.user) {
        const userData = data.user as any;
        const userInfo = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role || "CUSTOMER",
        };
        
        setIsLoggedIn(true);
        setUser(userInfo);
        
        // Update localStorage
        localStorage.setItem('user-session', JSON.stringify({
          ...userInfo,
          timestamp: Date.now()
        }));
      } else {
        // ✅ FALLBACK: Check localStorage if API fails
        const cachedSession = localStorage.getItem('user-session');
        
        if (cachedSession) {
          try {
            const parsed = JSON.parse(cachedSession);
            const age = Date.now() - (parsed.timestamp || 0);
            
            // ✅ FIXED: Use cached data if less than 30 minutes old (was 5 min)
            if (age < 30 * 60 * 1000) {
              setIsLoggedIn(true);
              setUser({
                id: parsed.id,
                email: parsed.email,
                name: parsed.name,
                role: parsed.role || "CUSTOMER",
              });
              return;
            }
          } catch (e) {
            console.error("Failed to parse cached session:", e);
          }
        }
        
        // No valid session
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('user-session');
      }
    } catch (error) {
      console.error("Auth check error:", error);
      
      // ✅ FALLBACK: Try localStorage on error too
      const cachedSession = localStorage.getItem('user-session');
      if (cachedSession) {
        try {
          const parsed = JSON.parse(cachedSession);
          const age = Date.now() - (parsed.timestamp || 0);
          
          // Check if cache is still valid
          if (age < 30 * 60 * 1000) {
            setIsLoggedIn(true);
            setUser({
              id: parsed.id,
              email: parsed.email,
              name: parsed.name,
              role: parsed.role || "CUSTOMER",
            });
            return;
          }
        } catch (e) {
          console.error("Fallback failed:", e);
        }
      }
      
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIXED: Listen for auth changes + quick recheck on mount
  useEffect(() => {
    // Initial check
    checkAuthStatus();

    // ✅ NEW: Quick recheck after 500ms for post-login scenarios
    const quickRecheck = setTimeout(() => {
      checkAuthStatus();
    }, 500);

    // Listen for custom auth-changed event
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    // Listen for visibility change (tab focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuthStatus();
      }
    };

    // Listen for storage changes (from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user-session') {
        checkAuthStatus();
      }
    };

    window.addEventListener('auth-changed', handleAuthChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearTimeout(quickRecheck); // ✅ NEW: Cleanup timeout
      window.removeEventListener('auth-changed', handleAuthChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
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
      await authClient.signOut();
      
      // Clear localStorage
      localStorage.removeItem('user-session');
      
      // Update state immediately
      setIsLoggedIn(false);
      setUser(null);
      
      toast({
        title: "Logged out successfully",
        description: "See you again soon!",
      });
      
      // Dispatch event
      window.dispatchEvent(new Event('auth-changed'));
      
      // Redirect
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 200);
      
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

  // Get role-specific styling
  const getRoleStyle = () => {
    if (user?.role === "ADMIN") {
      return {
        icon: ShieldCheck,
        color: "text-red-600",
        bgColor: "bg-red-50",
        hoverBg: "hover:bg-red-100",
        label: "Admin",
      };
    } else if (user?.role === "SELLER") {
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

  const roleStyle = getRoleStyle();
  const RoleIcon = roleStyle.icon;

  return (
    <header className="w-full border-b bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm">
      {/* Top Nav */}
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

        {/* Search Bar Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl border-2 rounded-xl overflow-hidden border-gray-200 dark:border-gray-700 focus-within:border-emerald-600 transition-colors"
        >
          <Input
            name="search"
            placeholder="Search medicine, medical products..."
            className="border-0 focus-visible:ring-0 h-11 bg-white dark:bg-gray-800"
          />

          <Button
            type="submit"
            className="rounded-none bg-emerald-600 hover:bg-emerald-700 px-6 h-11"
          >
            <Search className="h-5 w-5 text-white" />
          </Button>
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          {/* Wishlist */}
          <Link 
            href="/wishlist" 
            className="hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>

          {/* Cart */}
          <Link 
            href="/cart" 
            className="hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 relative"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {/* Profile / Auth */}
          {isLoading ? (
            <div className="p-2">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : isLoggedIn ? (
            // Logged In - Profile Dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`${roleStyle.bgColor} ${roleStyle.hoverBg} transition-colors p-2 rounded-lg flex items-center gap-2`}
                  aria-label="Profile Menu"
                >
                  <RoleIcon className={`h-5 w-5 ${roleStyle.color}`} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${roleStyle.bgColor} rounded-full flex items-center justify-center`}>
                      <RoleIcon className={`h-5 w-5 ${roleStyle.color}`} />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">{user?.name || user?.email}</p>
                      <p className={`text-xs font-medium ${roleStyle.color}`}>{roleStyle.label}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Dashboard - Admin/Seller only */}
                {(user?.role === "ADMIN" || user?.role === "SELLER") && getDashboardLink() && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link 
                        href={getDashboardLink()!} 
                        className="cursor-pointer"
                        onClick={() => {
                          // ✅ NEW: Refresh localStorage timestamp when clicking dashboard
                          const cachedSession = localStorage.getItem('user-session');
                          if (cachedSession) {
                            try {
                              const parsed = JSON.parse(cachedSession);
                              localStorage.setItem('user-session', JSON.stringify({
                                ...parsed,
                                timestamp: Date.now() // Refresh timestamp
                              }));
                            } catch (e) {
                              console.error("Failed to refresh session timestamp:", e);
                            }
                          }
                        }}
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                {/* Logout */}
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
            // Not Logged In - Sign In/Up
            <div className="hidden sm:flex gap-2">
              <Button 
                asChild 
                variant="ghost" 
                className="font-semibold text-sm hover:text-emerald-600 hover:bg-emerald-50"
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button 
                asChild 
                className="font-semibold text-sm bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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

      {/* Search Bar Mobile */}
      <div className="px-4 pb-3 md:hidden">
        <form
          onSubmit={handleSearch}
          className="flex border-2 rounded-xl overflow-hidden border-gray-200 dark:border-gray-700 focus-within:border-emerald-600"
        >
          <Input
            name="search"
            placeholder="Search medicine..."
            className="border-0 focus-visible:ring-0 h-10 bg-white dark:bg-gray-800"
          />
          <Button 
            type="submit" 
            className="rounded-none bg-emerald-600 hover:bg-emerald-700 px-5 h-10"
          >
            <Search className="h-4 w-4 text-white" />
          </Button>
        </form>
      </div>

      {/* Nav Links */}
      <nav className="border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          {/* Desktop Menu */}
          <ul className="hidden md:flex justify-center items-center gap-8 text-sm font-semibold py-3">
            <li>
              <Link href="/" className="hover:text-emerald-600 transition-colors py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-emerald-600 transition-colors py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-emerald-600 transition-colors py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-emerald-600 transition-colors py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                Contact
              </Link>
            </li>
          </ul>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <ul className="flex flex-col gap-2 py-4 md:hidden text-sm font-semibold border-t border-gray-200 dark:border-gray-800">
              <li>
                <Link 
                  href="/" 
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/shop" 
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 transition-colors"
                >
                  Contact
                </Link>
              </li>

              {/* Mobile - Not Logged In */}
              {!isLoading && !isLoggedIn && (
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 dark:border-gray-800 mt-2">
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
                    className="w-full justify-start bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Link href="/register" onClick={() => setMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}

              {/* Mobile - Logged In */}
              {!isLoading && isLoggedIn && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800 mt-2 space-y-2">
                  {/* User Info */}
                  <div className={`flex items-center gap-3 py-3 px-3 rounded-lg ${roleStyle.bgColor}`}>
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <RoleIcon className={`h-5 w-5 ${roleStyle.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{roleStyle.label}</p>
                      <p className="font-semibold text-sm">{user?.name || user?.email}</p>
                    </div>
                  </div>

                  {/* Dashboard - Admin/Seller only */}
                  {(user?.role === "ADMIN" || user?.role === "SELLER") && getDashboardLink() && (
                    <Link 
                      href={getDashboardLink()!}
                      onClick={() => {
                        setMenuOpen(false);
                        // ✅ NEW: Refresh localStorage timestamp
                        const cachedSession = localStorage.getItem('user-session');
                        if (cachedSession) {
                          try {
                            const parsed = JSON.parse(cachedSession);
                            localStorage.setItem('user-session', JSON.stringify({
                              ...parsed,
                              timestamp: Date.now()
                            }));
                          } catch (e) {
                            console.error("Failed to refresh session timestamp:", e);
                          }
                        }
                      }}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 transition-colors"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 transition-colors"
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