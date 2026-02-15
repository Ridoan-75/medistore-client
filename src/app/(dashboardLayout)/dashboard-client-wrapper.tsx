"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AppSidebar } from "@/src/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { Roles } from "@/src/constants/roles";
import { authClient } from "@/src/lib/auth-client";

interface User {
  id: string;
  email?: string;
  name?: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER";
}

interface DashboardClientWrapperProps {
  admin: React.ReactNode;
  seller: React.ReactNode;
}

interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}

export function DashboardClientWrapper({
  admin,
  seller,
}: DashboardClientWrapperProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const cachedSession = localStorage.getItem('user-session');
        
        if (cachedSession) {
          const parsed = JSON.parse(cachedSession);
          const age = Date.now() - (parsed.timestamp || 0);
          
          if (age < 30 * 60 * 1000) {
            if (parsed.role === Roles.ADMIN || parsed.role === Roles.SELLER) {
              setUser({
                id: parsed.id,
                email: parsed.email,
                name: parsed.name,
                role: parsed.role,
              });
              setIsLoading(false);
              return;
            } else {
              router.push("/");
              return;
            }
          }
        }

        const { data } = await authClient.getSession();
        
        if (!data?.user) {
          router.push("/login");
          return;
        }

        const userData = data.user as AuthUser;
        const userRole = userData.role || "CUSTOMER";
        
        if (userRole !== Roles.ADMIN && userRole !== Roles.SELLER) {
          router.push("/");
          return;
        }

        const userInfo: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userRole as "ADMIN" | "SELLER" | "CUSTOMER",
        };

        setUser(userInfo);

        localStorage.setItem('user-session', JSON.stringify({
          ...userInfo,
          timestamp: Date.now()
        }));

      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {user.role === Roles.ADMIN ? "Admin Dashboard" : "Seller Dashboard"}
            </span>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
          {user.role === Roles.ADMIN ? admin : seller}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}