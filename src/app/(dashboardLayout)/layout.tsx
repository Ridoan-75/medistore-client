import { AppSidebar } from "@/src/components/layout/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { Separator } from "@/src/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { Roles } from "@/src/constants/roles";
import { userService } from "@/src/services/user.service";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  admin,
  seller,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  seller: React.ReactNode;
}) {
  const { data } = await userService.getSession();
  const userInfo = data.user;

  return (
    <SidebarProvider>
      <AppSidebar user={userInfo} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {userInfo.role === Roles.ADMIN ? admin : seller}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
