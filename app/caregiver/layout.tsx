import type React from "react"
import { MainNav } from "@/components/navigation/main-nav"

interface CaregiverLayoutProps {
  children: React.ReactNode
}

export default function CaregiverLayout({ children }: CaregiverLayoutProps) {
  // 요양보호사 레이아웃
  const userRole = "caregiver"

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <MainNav userRole={userRole} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
