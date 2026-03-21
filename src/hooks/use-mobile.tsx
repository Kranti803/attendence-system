"use client"

import * as React from "react"

/**
 * Minimal `useIsMobile` hook used by the shadcn-style sidebar.
 * Uses a single breakpoint (md = 768px) to match Tailwind defaults.
 */
export function useIsMobile(breakpointPx: number = 768) {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`)

    const onChange = () => setIsMobile(media.matches)
    onChange()

    // Safari < 14 fallback
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange)
      return () => media.removeEventListener("change", onChange)
    }

    media.addListener(onChange)
    return () => media.removeListener(onChange)
  }, [breakpointPx])

  return isMobile
}

