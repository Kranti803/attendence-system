"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

type SidebarContextValue = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider.")
  return ctx
}

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open

  const setOpen = React.useCallback(
    (next: boolean) => {
      onOpenChange?.(next)
      if (!onOpenChange) _setOpen(next)
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [onOpenChange]
  )

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) return setOpenMobile((v) => !v)
    return setOpen(!open)
  }, [isMobile, open, setOpen])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [toggleSidebar])

  const state: SidebarContextValue["state"] = open ? "expanded" : "collapsed"

  const value = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, openMobile, isMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-sidebar-wrapper
        data-state={state}
        className={cn("flex min-h-screen w-full", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function Sidebar({
  className,
  children,
  collapsible = "offcanvas",
  ...props
}: React.ComponentProps<"aside"> & {
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const { isMobile, open, openMobile, setOpenMobile, state } = useSidebar()

  if (collapsible === "none") {
    return (
      <aside
        className={cn(
          "flex h-screen w-64 shrink-0 flex-col border-r bg-sidebar",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    )
  }

  if (isMobile) {
    return (
      <>
        {openMobile ? (
          <div className="fixed inset-0 z-50">
            <button
              aria-label="Close sidebar"
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpenMobile(false)}
            />
            <aside
              className={cn(
                "absolute inset-y-0 left-0 flex w-[18rem] flex-col border-r bg-sidebar shadow-2xl",
                className
              )}
              {...props}
            >
              {children}
            </aside>
          </div>
        ) : null}
      </>
    )
  }

  return (
    <aside
      data-state={state}
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200",
        open ? "w-64" : "w-14",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

export function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return <main className={cn("min-w-0 flex-1", className)} {...props} />
}

export function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent",
        className
      )}
      onClick={(e) => {
        onClick?.(e)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </button>
  )
}

export function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-4 py-4", className)} {...props} />
}

export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-auto border-t border-sidebar-border", className)} {...props} />
}

export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex min-h-0 flex-1 flex-col overflow-auto px-2 py-3", className)} {...props} />
}

export function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mb-3", className)} {...props} />
}

export function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted",
        className
      )}
      {...props}
    />
  )
}

export function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-1", className)} {...props} />
}

export function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("space-y-1", className)} {...props} />
}

export function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("relative", className)} {...props} />
}

type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  isActive?: boolean
  asChild?: boolean
}

function Slot({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children: React.ReactElement<any> }) {
  return React.cloneElement(
    children,
    {
      ...(props as any),
      className: cn(className, (children.props as any)?.className),
    } as any
  )
}

export function SidebarMenuButton({
  className,
  isActive,
  asChild,
  ...props
}: SidebarMenuButtonProps) {
  const { open } = useSidebar()
  const Comp: any = asChild ? Slot : "button"

  return (
    <Comp
      data-active={isActive ? "true" : "false"}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/12 text-foreground"
          : "text-sidebar-foreground hover:bg-primary/10 hover:text-foreground",
        !open ? "justify-center px-2" : null,
        className
      )}
      {...props}
    />
  )
}

