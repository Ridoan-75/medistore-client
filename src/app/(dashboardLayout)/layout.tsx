import { ReactNode } from "react";
import { AppSidebar } from "@/src/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { Roles } from "@/src/constants/roles";
import { userService } from "@/src/services/user.service";
import { Bell, Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
  children: ReactNode;
  admin: ReactNode;
  seller: ReactNode;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const getRoleLabel = (role: string): string => {
  if (role === Roles.ADMIN) return "Admin Dashboard";
  if (role === Roles.SELLER) return "Seller Dashboard";
  return "Dashboard";
};

export default async function DashboardLayout({
  admin,
  seller,
}: DashboardLayoutProps) {
  const { data } = await userService.getSession();
  const userInfo: UserInfo = data.user;

  const isAdmin = userInfo.role === Roles.ADMIN;
  const greeting = getGreeting();
  const roleLabel = getRoleLabel(userInfo.role);

  return (
    <SidebarProvider>
      <AppSidebar user={userInfo} />

      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
          <SidebarTrigger className="-ml-1 h-9 w-9 border-2 rounded-lg hover:bg-muted" />

          <div className="h-6 w-px bg-border" />

          <div className="hidden md:flex flex-col">
            <span className="text-xs text-muted-foreground">{greeting}</span>
            <span className="text-sm font-semibold text-foreground">
              {userInfo.name}
            </span>
          </div>

          <div className="flex-1" />

          <div className="hidden lg:flex relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-9 h-9 w-64 border-2 bg-muted/30"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="relative h-9 w-9 border-2 rounded-lg"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] font-bold text-white rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-sm font-bold text-white">
                {userInfo.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {userInfo.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {roleLabel}
              </span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col">
          {isAdmin ? admin : seller}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}