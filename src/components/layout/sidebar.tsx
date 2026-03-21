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
  BookOpen,
  History,
  User,
  ScanFace,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  Sidebar as UiSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

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
      { label: "Subjects", href: "/admin/subjects", icon: BookOpen },
      { label: "Classes", href: "/admin/classes", icon: Users },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Reports", href: "/admin/reports", icon: FileText },
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
      { label: "Subjects", href: "/student/subjects/CS101", icon: BookOpen },
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
  const { open, isMobile, setOpenMobile } = useSidebar();

  return (
    <UiSidebar>
      <SidebarHeader className={cn("border-b border-sidebar-border", !open && "px-2")}>
        <div className={cn("flex items-center gap-3", !open && "justify-center")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ScanFace className="h-5 w-5" />
          </div>
          {open ? (
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">
                {config.title}
              </h1>
              <p className="text-xs text-sidebar-muted font-medium">
                {config.subtitle}
              </p>
            </div>
          ) : null}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {open ? <SidebarGroupLabel>Navigation</SidebarGroupLabel> : null}
          <SidebarGroupContent>
            <SidebarMenu>
              {config.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (isMobile) setOpenMobile(false);
                        }}
                      >
                        <item.icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0 transition-colors",
                            isActive
                              ? "text-primary"
                              : "text-sidebar-muted group-hover:text-primary"
                          )}
                        />
                        {open ? <span>{item.label}</span> : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn("p-4", !open && "px-2")}>
        <div className={cn("flex items-center gap-3", !open && "justify-center")}>
          <Avatar fallback={config.user.initials} size="default" />
          {open ? (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {config.user.name}
              </p>
              <p className="truncate text-xs text-sidebar-muted">
                {config.user.role}
              </p>
            </div>
          ) : null}
        </div>
      </SidebarFooter>
    </UiSidebar>
  );
}
