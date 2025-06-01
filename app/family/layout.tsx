import type React from "react"
import { MainNav } from "@/components/navigation/main-nav"

interface FamilyLayoutProps {
  children: React.ReactNode
}

export default function FamilyLayout({ children }: FamilyLayoutProps) {
  // 가족 레이아웃
  const userRole = "family"

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <MainNav userRole={userRole} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
