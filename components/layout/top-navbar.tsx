"use client";

import React from "react";
import { Bell, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function TopNavbar({
  title,
  userInitials = "U",
}: {
  title: string;
  userInitials?: string;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
      {/* ── Page Title ── */}
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>

      {/* ── Right Section ── */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-9 w-64 pl-9 bg-muted/50 border-transparent focus-visible:border-input"
          />
        </div>

        {/* Notifications */}
        <button className="relative rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-accent cursor-pointer">
          <Avatar fallback={userInitials} size="sm" />
        </button>
      </div>
    </header>
  );
}
