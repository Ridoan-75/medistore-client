import { ReactNode } from "react";
import { Footer } from "@/src/components/layout/footer";
import { Header } from "@/src/components/layout/header";

export const dynamic = "force-dynamic";

interface CommonLayoutProps {
  children: ReactNode;
}

export default async function CommonLayout({ children }: CommonLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}