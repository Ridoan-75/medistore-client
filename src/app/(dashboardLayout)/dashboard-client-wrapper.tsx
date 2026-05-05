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
import { onAuthChange } from "@/src/lib/auth";

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

export function DashboardClientWrapper({
  admin,
  seller,
}: DashboardClientWrapperProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          router.push("/login");
          return;
        }

        const token = await firebaseUser.getIdToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        const userRole: string = data.role || "CUSTOMER";

        if (userRole !== Roles.ADMIN && userRole !== Roles.SELLER) {
          router.push("/");
          return;
        }

        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email ?? undefined,
          name: firebaseUser.displayName ?? data.name ?? undefined,
          role: userRole as "ADMIN" | "SELLER" | "CUSTOMER",
        });
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
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