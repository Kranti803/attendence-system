"use client";

import React from "react";
import { TopNavbar } from "@/components/layout/top-navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, BookOpen, MapPin, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudentOverallStats, useStudentCourseAttendance, useUpcomingClasses } from "@/hooks/useStudentDashboard";

/* ─── Donut Chart Component ─── */
function OverallAttendanceDonut({ value }: { value: number }) {
  const radius = 75;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const colorClass =
    value >= 90 ? "text-emerald-500" : value >= 75 ? "text-amber-500" : "text-red-500";

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="190" height="190" viewBox="0 0 190 190">
        <circle cx="95" cy="95" r={radius} fill="none" stroke="currentColor" opacity="0.12" strokeWidth={stroke} />
        <circle
          cx="95"
          cy="95"
          r={radius}
          fill="none"
          className={cn(colorClass, "transition-all duration-1000")}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 95 95)"
        />
        <text x="95" y="88" textAnchor="middle" fontSize="32" fontWeight="700" fill="currentColor">
          {value}%
        </text>
        <text x="95" y="110" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7">
          Overall
        </text>
      </svg>
    </div>
  );
}

/* ─── Page ─── */
export default function StudentDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useStudentOverallStats();
  const { data: courses, isLoading: coursesLoading } = useStudentCourseAttendance();
  const { data: upcomingClasses, isLoading: classesLoading } = useUpcomingClasses(7);

  const overallAttendance = stats?.semester_attendance_rate || 0;
  const classesAttended = stats?.classes_attended || 0;
  const classesMissed = stats?.classes_missed || 0;
  const streak = stats?.streak || 0;
  const userName = "Student"; // In production, get from auth context

  return (
    <>
      <TopNavbar title="Dashboard" userInitials="ST" />
      <div className="p-6 space-y-6">
        {/* ── Welcome ── */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {userName}! 👋
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
              {statsLoading ? (
                <div className="flex justify-center">
                  <Skeleton className="h-48 w-48 rounded-full" />
                </div>
              ) : (
                <>
                  <OverallAttendanceDonut value={overallAttendance} />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-emerald-50 p-3 text-center">
                      <p className="text-lg font-bold text-emerald-600">{classesAttended}</p>
                      <p className="text-xs text-emerald-700">Classes Attended</p>
                    </div>
                    <div className="rounded-xl bg-red-50 p-3 text-center">
                      <p className="text-lg font-bold text-red-600">{classesMissed}</p>
                      <p className="text-xs text-red-700">Classes Missed</p>
                    </div>
                  </div>
                  {streak > 0 && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 p-2 text-sm text-amber-700">
                      <Flame className="h-4 w-4" />
                      <span>{streak} day streak! 🔥</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Course-wise Attendance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Course-wise Attendance</CardTitle>
              <CardDescription>Attendance breakdown by subject</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {coursesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2.5 w-full" />
                    </div>
                  ))}
                </div>
              ) : courses && courses.length > 0 ? (
                courses.map((course) => {
                  const tones = [
                    "bg-blue-500",
                    "bg-purple-500",
                    "bg-pink-500",
                    "bg-green-500",
                  ];
                  const tone = tones[courses.indexOf(course) % tones.length];

                  return (
                    <div key={course.subject_id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={cn("h-3 w-3 rounded-full shrink-0", tone)} />
                          <div className="min-w-0">
                            <span className="text-sm font-medium text-foreground block truncate">
                              {course.subject_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {course.subject_code}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {course.classes_attended}/{course.total_classes}
                          </span>
                          <Badge
                            variant={
                              course.attendance_rate >= 90
                                ? "success"
                                : course.attendance_rate >= 75
                                ? "warning"
                                : "destructive"
                            }
                          >
                            {course.attendance_rate}%
                          </Badge>
                        </div>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            tone
                          )}
                          style={{ width: `${course.attendance_rate}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No enrollment data available
                </p>
              )}
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
                Next 7 Days
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {classesLoading ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
              </div>
            ) : upcomingClasses && upcomingClasses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {upcomingClasses.slice(0, 3).map((cls, i) => (
                  <div
                    key={i}
                    className="group rounded-xl border border-border p-4 transition-all hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-2 truncate">
                      {cls.subject_code}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {cls.subject_name}
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{cls.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{cls.start_time.substring(0, 5)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{cls.teacher_name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No upcoming classes in the next 7 days</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
