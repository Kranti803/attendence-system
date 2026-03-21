"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { cn } from "@/lib/utils"

/* ─── Base shadcn Avatar Primitives ─── */
function AvatarRoot({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg" | "xl"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 data-[size=xl]:size-16 dark:after:mix-blend-lighten",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary group-data-[size=sm]/avatar:text-xs group-data-[size=xl]/avatar:text-lg",
        className
      )}
      {...props}
    />
  )
}

/* ─── Convenience Avatar (matches old API) ─── */
function Avatar({
  className,
  src,
  alt,
  fallback,
  size = "default",
}: {
  className?: string
  src?: string
  alt?: string
  fallback: string
  size?: "sm" | "default" | "md" | "lg" | "xl"
}) {
  const sizeMap = {
    sm: "sm" as const,
    md: "default" as const,
    default: "default" as const,
    lg: "lg" as const,
    xl: "xl" as const,
  }

  return (
    <AvatarRoot size={sizeMap[size]} className={className}>
      {src && <AvatarImage src={src} alt={alt || fallback} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </AvatarRoot>
  )
}

export { Avatar, AvatarRoot, AvatarImage, AvatarFallback }
