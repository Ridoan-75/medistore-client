import { DashboardClientWrapper } from "./dashboard-client-wrapper";

export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  seller: React.ReactNode;
}

export default function DashboardLayout({
  admin,
  seller,
}: DashboardLayoutProps) {
  return <DashboardClientWrapper admin={admin} seller={seller} />;
}