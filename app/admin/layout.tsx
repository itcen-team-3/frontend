import type React from "react";
import { MainNav } from "@/components/navigation/main-nav";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // 관리자 레이아웃
  const userRole = "admin";

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <MainNav userRole={userRole} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
