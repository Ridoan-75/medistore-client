import { ReactNode } from "react";
import { Footer } from "@/src/components/layout/footer";
import { Header } from "@/src/components/layout/header";
import { userService } from "@/src/services/user.service";

export const dynamic = "force-dynamic";

interface CommonLayoutProps {
  children: ReactNode;
}

type UserRole = "ADMIN" | "CUSTOMER" | undefined;

const getUserRole = async (): Promise<UserRole> => {
  try {
    const { data } = await userService.getSession();
    return data?.user?.role as UserRole;
  } catch {
    return undefined;
  }
};

export default async function CommonLayout({ children }: CommonLayoutProps) {
  const userRole = await getUserRole();

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <Header userRole={userRole} />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}