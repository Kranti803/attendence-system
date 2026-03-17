import Link from "next/link";
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  ScanFace,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const roles = [
    {
      title: "Admin Portal",
      description:
        "Manage students, teachers, classes, and view system-wide analytics.",
      href: "/admin/dashboard",
      icon: ShieldCheck,
      gradient: "from-indigo-500 to-purple-600",
      shadow: "shadow-indigo-500/25",
    },
    {
      title: "Teacher Portal",
      description:
        "Take attendance using face recognition, manage classes, and generate reports.",
      href: "/teacher/dashboard",
      icon: GraduationCap,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/25",
    },
    {
      title: "Student Portal",
      description:
        "View your attendance history, track progress, and manage your profile.",
      href: "/student/dashboard",
      icon: BookOpen,
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/25",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* ── Logo ── */}
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
          <ScanFace className="h-7 w-7" />
        </div>
      </div>
      <h1 className="mb-1 text-3xl font-bold tracking-tight text-foreground">
        AttendVision
      </h1>
      <p className="mb-10 text-center text-muted-foreground max-w-md">
        Computer-vision-based smart attendance system with real-time face
        recognition.
      </p>

      {/* ── Role Cards ── */}
      <div className="grid w-full max-w-3xl gap-5 md:grid-cols-3">
        {roles.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${role.gradient} text-white shadow-lg ${role.shadow}`}
            >
              <role.icon className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              {role.title}
            </h2>
            <p className="mb-4 flex-1 text-sm text-muted-foreground leading-relaxed">
              {role.description}
            </p>
            <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
              Enter Portal
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        © 2026 AttendVision. All rights reserved.
      </p>
    </div>
  );
}
