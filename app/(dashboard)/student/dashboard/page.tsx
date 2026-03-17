"use client";

import { TopNavbar } from "@/components/layout/top-navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, BookOpen, MapPin } from "lucide-react";

/* ─── Static Data ─── */
const courses = [
  { name: "CS101 — Intro to CS",        attendance: 92, total: 25, attended: 23, color: "#4F46E5" },
  { name: "MATH201 — Linear Algebra",   attendance: 88, total: 24, attended: 21, color: "#6366F1" },
  { name: "PHY301 — Quantum Physics",   attendance: 76, total: 22, attended: 17, color: "#818CF8" },
  { name: "ENG102 — Technical Writing", attendance: 96, total: 20, attended: 19, color: "#A5B4FC" },
];

const upcomingClasses = [
  { name: "CS101 — Intro to CS",        time: "11:00 AM", room: "Room 201", teacher: "Dr. Sarah Wilson" },
  { name: "MATH201 — Linear Algebra",   time: "02:00 PM", room: "Room 305", teacher: "Prof. James Carter" },
  { name: "PHY301 — Quantum Physics",   time: "04:00 PM", room: "Lab 3",    teacher: "Dr. Emily Chen" },
];

/* ─── Donut Chart Component ─── */
function OverallAttendanceDonut({ value }: { value: number }) {
  const radius = 75;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 90 ? "#22C55E" : value >= 75 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="190" height="190" viewBox="0 0 190 190">
        <circle cx="95" cy="95" r={radius} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
        <circle
          cx="95"
          cy="95"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 95 95)"
          className="transition-all duration-1000"
        />
        <text x="95" y="88" textAnchor="middle" fontSize="32" fontWeight="700" fill="#0F172A">
          {value}%
        </text>
        <text x="95" y="110" textAnchor="middle" fontSize="12" fill="#64748B">
          Overall
        </text>
      </svg>
    </div>
  );
}

/* ─── Page ─── */
export default function StudentDashboardPage() {
  const overallAttendance = 88;

  return (
    <>
      <TopNavbar title="Dashboard" userInitials="JD" />
      <div className="p-6 space-y-6">
        {/* ── Welcome ── */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, John! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s an overview of your attendance this semester.
          </p>
        </div>

        {/* ── Overall Stats + Donut ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Overall Attendance</CardTitle>
              <CardDescription>Current semester</CardDescription>
            </CardHeader>
            <CardContent>
              <OverallAttendanceDonut value={overallAttendance} />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-center">
                  <p className="text-lg font-bold text-emerald-600">80</p>
                  <p className="text-xs text-emerald-700">Classes Attended</p>
                </div>
                <div className="rounded-xl bg-red-50 p-3 text-center">
                  <p className="text-lg font-bold text-red-600">11</p>
                  <p className="text-xs text-red-700">Classes Missed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course-wise Attendance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Course-wise Attendance</CardTitle>
              <CardDescription>Attendance breakdown by subject</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map((course) => (
                <div key={course.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {course.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {course.attended}/{course.total} classes
                      </span>
                      <Badge
                        variant={
                          course.attendance >= 90
                            ? "success"
                            : course.attendance >= 75
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {course.attendance}%
                      </Badge>
                    </div>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${course.attendance}%`,
                        backgroundColor: course.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Upcoming Classes ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Classes</CardTitle>
              <Badge variant="default">
                <Calendar className="h-3 w-3 mr-1" />
                Today
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {upcomingClasses.map((cls, i) => (
                <div
                  key={i}
                  className="group rounded-xl border border-border p-4 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">
                    {cls.name}
                  </h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {cls.time}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {cls.room}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cls.teacher}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
