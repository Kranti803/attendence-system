"use client";

import Link from "next/link";
import { ScanFace, ArrowRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ─── Navbar ─── */}
      <nav className="border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ScanFace className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              AttendVision
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-0">
          {/* Copy */}
          <div className="max-w-xl">
            <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              Open your camera. You're marked present.
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Students Attendance System. AttendVision
              recognizes each face and logs attendance instantly, no roll
              call, no waiting.
            </p>

            <div className="flex flex-col items-start gap-3 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-base rounded-xl">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base rounded-xl"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <LockKeyhole className="h-4 w-4 shrink-0" />
              Face data is encrypted and stays under your institution's control.
            </div>
          </div>

          {/* Signature visual: a detection bracket, like a live face-match frame */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-card">
              {/* corner brackets */}
              <span className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-primary rounded-tl-md" />
              <span className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-primary rounded-tr-md" />
              <span className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-primary rounded-bl-md" />
              <span className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-primary rounded-br-md" />

              {/* scan sweep */}
              <span className="scan-line pointer-events-none absolute inset-x-0 h-px bg-primary/70" />

              {/* status pill */}
              <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Scanning
              </div>

              {/* face icon */}
              <div className="flex h-full items-center justify-center">
                <ScanFace className="h-20 w-20 text-muted-foreground/40" />
              </div>

              {/* match readout */}
              <div className="absolute inset-x-4 bottom-4 rounded-lg border border-border/70 bg-background/80 px-3 py-2 backdrop-blur">
                <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
                  MATCH&nbsp;&nbsp;A.&nbsp;JOHNSON&nbsp;&nbsp;99.2%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-8 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ScanFace className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-foreground">
              AttendVision
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Support
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 AttendVision. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes scanSweep {
          0% { top: 8%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 92%; opacity: 0; }
        }
        .scan-line {
          animation: scanSweep 3.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .scan-line { animation: none; display: none; }
        }
      `}</style>
    </div>
  );
}