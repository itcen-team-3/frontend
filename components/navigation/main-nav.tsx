"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  ClipboardList,
  Clock,
  Users,
  User,
  DollarSign,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

interface MainNavProps {
  userRole: string;
}

export function MainNav({ userRole }: MainNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const navItems: NavItem[] = [
    {
      title: "홈",
      href: userRole === "admin" ? "/admin/dashboard" : "/caregiver/dashboard",
      icon: <Home className="w-6 h-6 mr-2" />,
      roles: ["caregiver", "admin", "family"],
    },
    {
      title: "돌봄일지",
      href: "/caregiver/care-logs",
      icon: <ClipboardList className="w-6 h-6 mr-2" />,
      roles: ["caregiver"],
    },
    {
      title: "돌봄일지 관리",
      href: "/admin/care-logs",
      icon: <ClipboardList className="w-6 h-6 mr-2" />,
      roles: ["admin"],
    },
    {
      title: "출퇴근 관리",
      href: "/caregiver/attendance",
      icon: <Clock className="w-6 h-6 mr-2" />,
      roles: ["caregiver"],
    },
    {
      title: "출퇴근 소명 관리",
      href: "/admin/attendance",
      icon: <Clock className="w-6 h-6 mr-2" />,
      roles: ["admin"],
    },
    {
      title: "요양보호사 관리",
      href: "/admin/caregivers",
      icon: <Users className="w-6 h-6 mr-2" />,
      roles: ["admin"],
    },
    {
      title: "보호대상자 관리",
      href: "/admin/patients",
      icon: <User className="w-6 h-6 mr-2" />,
      roles: ["admin"],
    },
    {
      title: "스케줄 관리",
      href: "/admin/schedules",
      icon: <Calendar className="w-6 h-6 mr-2" />,
      roles: ["admin"],
    },
    {
      title: "스케줄 확인",
      href: "/caregiver/schedules",
      icon: <Calendar className="w-6 h-6 mr-2" />,
      roles: ["caregiver"],
    },
    {
      title: "계정 관리",
      href: "/admin/accounts",
      icon: <Users className="w-6 h-6 mr-2" />,
      roles: ["admin"],
    },
    {
      title: "급여 관리",
      href: "/admin/salary",
      icon: <DollarSign className="w-6 h-6 mr-2" />,
      roles: ["admin"],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-4 fixed bottom-0 left-0 right-0 z-50 md:relative md:border-b-0">
      <div className="hidden md:flex items-center space-x-6">
        {filteredNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center text-lg font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </div>

      <div className="flex md:hidden justify-around w-full">
        {filteredNavItems.slice(0, 4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}

        {filteredNavItems.length > 4 && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex flex-col items-center justify-center"
              >
                <Menu className="w-6 h-6 mb-1" />
                <span className="text-sm">더보기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] pt-10">
              <div className="grid gap-6 p-4">
                {filteredNavItems.slice(4).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center text-lg font-medium p-2 rounded-lg transition-colors hover:bg-muted",
                      pathname === item.href
                        ? "bg-muted text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
}
