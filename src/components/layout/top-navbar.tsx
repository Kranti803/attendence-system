"use client";

import React from "react";
import { Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationPanel, type NotificationPanelProps } from "./notification-panel";
import type { NotificationEvent } from "@/hooks/useNotifications";

export function TopNavbar({
  title,
  userInitials = "U",
  notifications,
  isNotificationsConnected = false,
  onClearNotifications,
}: {
  title: string;
  userInitials?: string;
  notifications?: NotificationEvent[];
  isNotificationsConnected?: boolean;
  onClearNotifications?: () => void;
}) {
  // Show notifications only if they're provided (students only)
  const showNotifications = notifications !== undefined;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
      {/* ── Left Section ── */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>

      {/* ── Right Section ── */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-9 w-64 pl-9 bg-muted/50 border-transparent focus-visible:border-input"
          />
        </div>

        {/* Notifications - Only for students */}
        {showNotifications && (
          <NotificationPanel
            notifications={notifications}
            isConnected={isNotificationsConnected}
            onClear={onClearNotifications}
          />
        )}

        {/* Divider - Only show if notifications are visible */}
        {showNotifications && <div className="h-6 w-px bg-border" />}

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-accent cursor-pointer">
          <Avatar fallback={userInitials} size="sm" />
        </button>
      </div>
    </header>
  );
}
