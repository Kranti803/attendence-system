"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BarChart3,
  Camera,
  FileText,
  History,
  User,
  ScanFace,
  LogOut,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

/* ─── Navigation Config ─── */
interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarConfig {
  title: string;
  subtitle: string;
  items: NavItem[];
  user: { name: string; role: string; initials: string };
}

const configs: Record<string, SidebarConfig> = {
  admin: {
    title: "AttendVision",
    subtitle: "Admin Portal",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Students", href: "/admin/students", icon: Users },
      { label: "Teachers", href: "/admin/teachers", icon: GraduationCap },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
    user: { name: "Admin User", role: "Super Admin", initials: "AU" },
  },
  teacher: {
    title: "AttendVision",
    subtitle: "Teacher Portal",
    items: [
      { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
      { label: "Attendance", href: "/teacher/attendance", icon: Camera },
      { label: "Reports", href: "/teacher/reports", icon: FileText },
    ],
    user: { name: "Dr. Sarah Wilson", role: "Professor", initials: "SW" },
  },
  student: {
    title: "AttendVision",
    subtitle: "Student Portal",
    items: [
      { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
      { label: "Attendance History", href: "/student/history", icon: History },
      { label: "Profile", href: "/student/profile", icon: User },
    ],
    user: { name: "John Doe", role: "Student", initials: "JD" },
  },
};

/* ─── Component ─── */
export function Sidebar({ role }: { role: "admin" | "teacher" | "student" }) {
  const pathname = usePathname();
  const config = configs[role];

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[272px] flex-col border-r border-sidebar-border bg-sidebar">
      {/* ── Brand ── */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <ScanFace className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground tracking-tight">
            {config.title}
          </h1>
          <p className="text-xs text-sidebar-muted font-medium">
            {config.subtitle}
          </p>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 h-px bg-sidebar-border" />

      {/* ── Navigation ── */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
          Navigation
        </p>
        {config.items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-sidebar-muted group-hover:text-primary"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Section ── */}
      <div className="mt-auto border-t border-sidebar-border">
        <div className="px-3 py-2">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent/50"
          >
            <Settings className="h-[18px] w-[18px] text-sidebar-muted" />
            Settings
          </Link>
        </div>
        <div className="mx-4 h-px bg-sidebar-border" />
        <div className="flex items-center gap-3 px-6 py-4">
          <Avatar fallback={config.user.initials} size="md" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {config.user.name}
            </p>
            <p className="truncate text-xs text-sidebar-muted">
              {config.user.role}
            </p>
          </div>
          <button className="rounded-lg p-1.5 text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-destructive cursor-pointer">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
