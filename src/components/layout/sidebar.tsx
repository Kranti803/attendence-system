"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ChevronsUpDown,
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  BookUser,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useProfile, useLogout } from "@/hooks/useAuth";

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
      { label: "Enrollments", href: "/admin/enrollments", icon: BookUser },
      { label: "Classes", href: "/admin/classes", icon: Users },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Reports", href: "/admin/reports", icon: FileText },
    ],
  },
  teacher: {
    title: "AttendVision",
    subtitle: "Teacher Portal",
    items: [
      { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
      { label: "Attendance", href: "/teacher/attendance", icon: Camera },
      { label: "Reports", href: "/teacher/reports", icon: FileText },
    ],
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
  },
};

/* ─── Component ─── */
export function Sidebar({ role }: { role: "admin" | "teacher" | "student" }) {
  const pathname = usePathname();
  const router = useRouter();
  const config = configs[role];
  const { open, isMobile, setOpenMobile } = useSidebar();
  const { data: profile } = useProfile();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        router.push("/login");
      },
    });
  };

  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.email
    : "Loading...";
  const displayRole = profile?.user_type ?? role;
  const initials = profile
    ? [profile.first_name?.[0], profile.last_name?.[0]]
        .filter(Boolean)
        .join("")
        .toUpperCase() || profile.email[0].toUpperCase()
    : "?";

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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground p-0 hover:bg-transparent"
                asChild
              >
                <DropdownMenuTrigger className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-foreground">
                  <Avatar fallback={initials} size="sm" className="h-8 w-8 rounded-lg" />
                  {open ? (
                    <>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{displayName}</span>
                        <span className="truncate text-xs">{profile?.email || ""}</span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </>
                  ) : null}
                </DropdownMenuTrigger>
              </SidebarMenuButton>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar fallback={initials} size="sm" className="h-8 w-8 rounded-lg" />
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{displayName}</span>
                        <span className="truncate text-xs">{profile?.email || ""}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                  <LogOut className="mr-2" />
                  {logoutMutation.isPending ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </UiSidebar>
  );
}
