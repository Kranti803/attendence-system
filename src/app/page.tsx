"use client";

import Link from "next/link";
import {
  ScanFace,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Zap,
  Eye,
  BarChart3,
  Clock,
  Users,
  Sparkles,
  Camera,
  Layers,
  LockKeyhole,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Static Data ─── */
const features = [
  {
    icon: Eye,
    title: "Face Recognition",
    description:
      "Reliable face detection and recognition marks attendance in real time with high accuracy.",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description:
      "Fast recognition pipeline processes multiple faces simultaneously within seconds.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Clear insights into attendance patterns, department trends, and recognition performance.",
  },
  {
    icon: Clock,
    title: "Real-time Tracking",
    description: "Live attendance feeds with instant status updates and notification alerts.",
  },
  {
    icon: Users,
    title: "Multi-role Access",
    description: "Tailored dashboards for administrators, teachers, and students with role-based permissions.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with encrypted face data and audit trail logging.",
  },
];

const stats = [
  { value: "99.2%", label: "Recognition Accuracy" },
  { value: "< 1s", label: "Processing Time" },
  { value: "50K+", label: "Students Enrolled" },
  { value: "99.9%", label: "System Uptime" },
];

const howItWorks = [
  {
    icon: Camera,
    title: "Enroll faces once",
    description:
      "Capture high-quality face data during onboarding and automatically organize by class and role.",
  },
  {
    icon: Layers,
    title: "Run attendance in seconds",
    description:
      "Open a session, scan the classroom, and let real-time recognition mark students instantly.",
  },
  {
    icon: BarChart3,
    title: "Review insights & exports",
    description:
      "Spot patterns, track late arrivals, and export reports for departments, classes, and dates.",
  },
];

const trust = [
  { label: "Secure storage", icon: LockKeyhole },
  { label: "Audit logs", icon: BadgeCheck },
  { label: "Role-based access", icon: ShieldCheck },
  { label: "Accuracy tuned", icon: BadgeCheck },
];

const faqs = [
  {
    q: "Is face data stored securely?",
    a: "Yes. Face data is encrypted at rest and access is restricted by role-based permissions.",
  },
  {
    q: "Can teachers take attendance on any device?",
    a: "Yes. The system is responsive and works on laptops and tablets with a camera.",
  },
  {
    q: "How fast is recognition?",
    a: "Most sessions complete in under a second per scan, depending on lighting and device performance.",
  },
  {
    q: "Can we export attendance reports?",
    a: "Yes. You can generate class-level and institution-level reports for compliance and analysis.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ScanFace className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              AttendVision
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#stats" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Stats
            </a>
          </div>
          <div className="flex items-center gap-3">
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

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        {/* Background Grid + Gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30" />
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute -right-28 top-28 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-xl">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Face Recognition & Detection Attendance
              </div>

              {/* Headline */}
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-6xl">
                Attendance that feels{" "}
                <span className="bg-linear-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
                  instant
                </span>
                .
              </h1>

              {/* Subtitle */}
              <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
                Mark attendance in real time using face detection and
                recognition, keep records clean with role-based access, and
                understand patterns with analytics.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col items-start gap-4 sm:flex-row">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="h-12 px-8 text-base rounded-xl shadow-lg shadow-primary/25"
                  >
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base rounded-xl"
                  >
                    Explore Features
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 grid grid-cols-2 gap-3 text-sm text-muted-foreground sm:flex sm:flex-wrap sm:items-center">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  14-day free trial
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Encrypted face data
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Audit trail logging
                </div>
              </div>
            </div>

            {/* Product Preview */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-primary/15 via-transparent to-primary/15 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <ScanFace className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Live Session
                      </p>
                      <p className="text-xs text-muted-foreground">
                        CS101 · 09:00–10:00
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Scanning
                  </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Attendance
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {[
                        {
                          label: "Present",
                          value: "28",
                          tone: "text-emerald-600 bg-emerald-500/10",
                        },
                        {
                          label: "Late",
                          value: "3",
                          tone: "text-amber-600 bg-amber-500/10",
                        },
                        {
                          label: "Absent",
                          value: "2",
                          tone: "text-destructive bg-destructive/10",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className={`rounded-xl px-3 py-2 ${s.tone}`}
                        >
                          <p className="text-lg font-extrabold leading-none">
                            {s.value}
                          </p>
                          <p className="mt-1 text-[11px] font-semibold">
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Updated now
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> 33 students
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Recent Matches
                    </p>
                    <div className="mt-3 space-y-2">
                      {[
                        {
                          name: "A. Johnson",
                          status: "Present",
                          tone: "bg-emerald-500/10 text-emerald-600",
                        },
                        {
                          name: "C. Brown",
                          status: "Late",
                          tone: "bg-amber-500/10 text-amber-600",
                        },
                        {
                          name: "D. Ross",
                          status: "Present",
                          tone: "bg-emerald-500/10 text-emerald-600",
                        },
                      ].map((r) => (
                        <div
                          key={r.name}
                          className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                              {r.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <p className="text-sm font-medium text-foreground">
                              {r.name}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.tone}`}
                          >
                            {r.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/60 px-5 py-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {trust.slice(0, 4).map((t) => (
                      <div
                        key={t.label}
                        className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-3 py-2 text-xs font-medium text-muted-foreground"
                      >
                        <t.icon className="h-4 w-4 text-primary" />
                        {t.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section id="stats" className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-primary sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="features" className="relative overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Features
            </div>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Everything you need for{" "}
              <span className="text-primary">modern attendance</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              A comprehensive suite of tools designed to make attendance
              management effortless, accurate, and insightful.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative overflow-hidden border-t border-border bg-card/30">
        <div className="absolute -left-24 top-16 h-[420px] w-[420px] rounded-full bg-primary/8 blur-[110px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              How it works
            </div>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              From onboarding to insights in{" "}
              <span className="text-primary">3 steps</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              A simple flow that fits real classrooms and scales to departments.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {howItWorks.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-semibold text-muted-foreground">
                    Step {i + 1}
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {trust.map((t) => (
              <div
                key={t.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-2 text-xs font-semibold text-muted-foreground"
              >
                <t.icon className="h-4 w-4 text-primary" />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute -right-24 top-24 h-[420px] w-[420px] rounded-full bg-primary/8 blur-[110px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              FAQ
            </div>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Answers, without the fluff
            </h2>
            <p className="text-lg text-muted-foreground">
              The essentials institutions usually ask before rolling out.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-4">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <p className="text-base font-semibold text-foreground">
                  {f.q}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Ready to modernize your attendance?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join institutions using face recognition and detection for faster,
              cleaner attendance tracking. Get started in minutes.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-base rounded-xl shadow-lg shadow-primary/25">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ScanFace className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-foreground">
                AttendVision
              </span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Support
              </a>
              <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Contact
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 AttendVision. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
