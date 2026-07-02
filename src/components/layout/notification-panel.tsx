"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, AlertCircle, CheckCircle, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationEvent } from "@/hooks/useNotifications";

export interface NotificationPanelProps {
  notifications: NotificationEvent[];
  isConnected: boolean;
  onClear?: () => void;
}

export function NotificationPanel({
  notifications,
  isConnected,
  onClear,
}: NotificationPanelProps) {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.length);
  }, [notifications]);

  const handleClear = () => {
    setUnreadCount(0);
    if (onClear) {
      onClear();
    }
  };

  const handleNotificationClick = () => {
    setUnreadCount(0);
    setOpen(true);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "session_started":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "session_ended":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "attendance_marked":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "session_started":
        return "border-l-4 border-red-500 bg-red-50 dark:bg-red-950";
      case "session_ended":
        return "border-l-4 border-green-500 bg-green-50 dark:bg-green-950";
      case "attendance_marked":
        return "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950";
      default:
        return "border-l-4 border-muted bg-muted/50";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div
          role="button"
          tabIndex={0}
          className="relative rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
          onClick={handleNotificationClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleNotificationClick();
            }
          }}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          )}
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
              {Math.min(unreadCount, 9)}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            {!isConnected && (
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            )}
            {isConnected && (
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            )}
          </div>
          {notifications.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 opacity-50" />
              <p className="text-sm">No notifications yet</p>
              {isConnected && (
                <p className="text-xs">Connected to real-time updates</p>
              )}
              {!isConnected && (
                <p className="text-xs text-yellow-600">
                  Connecting to notifications...
                </p>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-4 py-3 text-sm transition-colors hover:bg-accent/50 cursor-pointer",
                    getNotificationColor(notification.type)
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.timestamp && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                        </p>
                      )}
                      {notification.confidence !== undefined && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Confidence: {(notification.confidence * 100).toFixed(0)}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t px-4 py-2 text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="h-3 w-3 text-green-500" />
              Connected
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-yellow-500" />
              Reconnecting...
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
