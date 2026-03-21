"use client";

import Link from "next/link";
import { ScanFace, ArrowRight, Mail, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-25" />
        <div className="absolute inset-0 bg-linear-to-b from-primary/8 via-transparent to-transparent" />
        <div className="absolute -top-24 left-1/2 h-[520px] w-[780px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute -right-40 top-32 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          {/* Left: Brand / Value */}
          <div className="hidden lg:block">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <ScanFace className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-foreground">
                  AttendVision
                </p>
                <p className="text-sm text-muted-foreground">
                  Smart Attendance System
                </p>
              </div>
            </Link>

            <div className="mt-10 max-w-lg">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                Secure sign in
                <ArrowRight className="h-4 w-4" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                Welcome back.
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Sign in to access your portal and continue managing attendance
                with real-time recognition and analytics.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <Badge variant="secondary">Admin</Badge>
                <Badge variant="secondary">Teacher</Badge>
                <Badge variant="secondary">Student</Badge>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="mx-auto w-full max-w-md">
            <Card className="border-border/70 bg-card/70 shadow-2xl backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">Sign in</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Use your institutional credentials.
                    </p>
                  </div>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                    Back
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@university.edu"
                      className="h-11 pl-9"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Link
                      href="#"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 pl-9"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border border-input accent-primary"
                  />
                  Remember me
                </label>

                <Button className="h-11 w-full text-base">
                  Sign in
                  <ArrowRight className="h-5 w-5" />
                </Button>

                <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">
                    Demo navigation (UI only)
                  </p>
                  <p className="mt-1">
                    Jump directly to a portal for preview:
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <Link href="/admin/dashboard">
                      <Button variant="outline" size="sm" className="w-full">
                        Admin
                      </Button>
                    </Link>
                    <Link href="/teacher/dashboard">
                      <Button variant="outline" size="sm" className="w-full">
                        Teacher
                      </Button>
                    </Link>
                    <Link href="/student/dashboard">
                      <Button variant="outline" size="sm" className="w-full">
                        Student
                      </Button>
                    </Link>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="#" className="font-medium text-primary hover:underline">
                    Contact admin
                  </Link>
                </p>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              © 2026 AttendVision · Privacy · Terms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

