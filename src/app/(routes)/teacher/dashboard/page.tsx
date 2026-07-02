"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TopNavbar } from "@/components/layout/top-navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  Users,
  CheckCircle2,
  TrendingUp,
  Play,
  Camera,
  Clock,
  Loader2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { useClassSessions } from "@/hooks/useClassSession";
import { useTeacherAttendance } from "@/hooks/useAttendance";
import { useProfile } from "@/hooks/useAuth";

// Helper function to convert 24-hour time to 12-hour format with AM/PM
const formatTime12Hour = (timeStr: string): string => {
  if (!timeStr) return "—";
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export default function TeacherDashboardPage() {
  const router = useRouter();
  
  const { data: classSessions = [], isLoading: isLoadingSessions } = useClassSessions();
  const { data: attendanceRecords = [], isLoading: isLoadingAttendance } = useTeacherAttendance();
  const { data: profile } = useProfile();

  // Get dynamic user initials
  const userInitials = profile
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase()
    : "U";

  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const currentTimeString = now.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" });

  // ── Compute Today's Classes ──
  const todayClasses = classSessions
    .filter((session) => session.date === today)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  // ── Compute Active Session ──
  // A session is active if start_time <= current time <= end_time
  const activeSession = todayClasses.find((session) => {
    return session.start_time <= currentTimeString && session.end_time >= currentTimeString;
  });

  // ── Compute Today's Attendance Stats ──
  const todayAttendance = attendanceRecords.filter((record) => {
    // extract date from marked_at
    const markedDate = new Date(record.marked_at).toISOString().split("T")[0];
    return markedDate === today;
  });

  const studentsPresent = todayAttendance.filter((r) => r.status === "PRESENT").length;
  // If we don't have total enrolled easily available for "Attendance Rate", 
  // we can use Total present / (Total present + Total absent) for today's records.
  const totalMarkedToday = todayAttendance.length;
  const attendanceRate = totalMarkedToday > 0 ? ((studentsPresent / totalMarkedToday) * 100).toFixed(1) : "0.0";

  // ── Compute Class Performance ──
  const classPerformance = classSessions.reduce((acc, session) => {
    const classAttendance = attendanceRecords.filter(
      (r) => r.class_session_detail?.id === session.id
    );
    const present = classAttendance.filter((r) => r.status === "PRESENT").length;
    const total = classAttendance.length;
    const rate = total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";
    
    acc[session.id] = { name: session.class_name, rate: parseFloat(rate) };
    return acc;
  }, {} as Record<string, { name: string; rate: number }>);

  // ── Compute Detection Quality ──
  const allLogs = attendanceRecords.flatMap((r) => r.verification_log ? [r.verification_log] : []);
  const avgConfidence = allLogs.length > 0
    ? (allLogs.reduce((sum, log) => sum + (log.face_confidence || 0), 0) / allLogs.length * 100).toFixed(1)
    : "0.0";
  const suspiciousCount = allLogs.filter((log) => log.is_suspicious).length;

  const stats = [
    { label: "Today's Classes", value: todayClasses.length.toString(), icon: BookOpen, color: "bg-primary/10 text-primary" },
    { label: "Active Session", value: activeSession ? activeSession.class_name : "None", icon: Play, color: "bg-emerald-50 text-emerald-600" },
    { label: "Students Present", value: studentsPresent.toString(), icon: Users, color: "bg-amber-50 text-amber-600" },
    { label: "Attendance Rate", value: `${attendanceRate}%`, icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
  ];

  // ── Recent Recognitions (Limit to 5) ──
  const recentActivity = todayAttendance.slice(0, 5);

  return (
    <>
      <TopNavbar title="Dashboard" userInitials={userInitials} />
      <div className="p-6 space-y-6">
        {/* ── Stats Cards ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    {isLoadingSessions || isLoadingAttendance ? (
                      <div className="mt-1">
                        <Skeleton className="h-8 w-16" />
                      </div>
                    ) : (
                      <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                    )}
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Class Performance & Detection Quality ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Class Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Class Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSessions || isLoadingAttendance ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : Object.entries(classPerformance).length === 0 ? (
                <p className="text-sm text-muted-foreground">No class data available</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(classPerformance).map(([_, data]) => (
                    <div key={data.name} className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{data.name}</p>
                      <Badge
                        variant={
                          data.rate >= 80 ? "success" : data.rate >= 60 ? "warning" : "destructive"
                        }
                      >
                        {data.rate.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detection Quality */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detection Quality</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAttendance ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Avg Confidence</p>
                    <p className="text-sm font-bold text-primary">{avgConfidence}%</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Suspicious</p>
                    <Badge variant={suspiciousCount > 0 ? "destructive" : "success"}>
                      {suspiciousCount}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Camera Feed Shortcut + Recent ── */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Camera Feed Shortcut */}
          <Card className="lg:col-span-3 border-2 border-muted hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attendance Command Center</CardTitle>
                <Badge variant="outline" className="gap-1">
                  Ready
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="relative flex aspect-video cursor-pointer items-center justify-center rounded-xl bg-slate-900 overflow-hidden group"
                onClick={() => router.push("/teacher/attendance")}
              >
                {/* Scanline animation overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-size-[100%_4px] group-hover:bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 group-hover:text-white/80 transition-colors">
                  <Camera className="h-12 w-12 mb-3" />
                  <p className="text-lg font-semibold tracking-wide">LAUNCH COMMAND CENTER</p>
                  <p className="text-sm text-white/40 mt-1 text-center px-4">
                    Click to start the live camera feed and capture attendance for your classes.
                  </p>
                </div>
                {/* Corner markers */}
                <div className="absolute top-4 left-4 h-8 w-8 border-l-2 border-t-2 border-primary/50 group-hover:border-primary transition-colors rounded-tl-lg" />
                <div className="absolute top-4 right-4 h-8 w-8 border-r-2 border-t-2 border-primary/50 group-hover:border-primary transition-colors rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 h-8 w-8 border-l-2 border-b-2 border-primary/50 group-hover:border-primary transition-colors rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 h-8 w-8 border-r-2 border-b-2 border-primary/50 group-hover:border-primary transition-colors rounded-br-lg" />
              </div>
              <div className="mt-4 flex gap-3">
                <Button className="w-full font-semibold" onClick={() => router.push("/teacher/attendance")}>
                  <Play className="h-4 w-4 mr-2 fill-current" />
                  Go to Command Center
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Recognitions */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="shrink-0 border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Today's Recognitions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-2 min-h-[300px]">
              {isLoadingAttendance ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 min-w-0 space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center px-4">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <Users className="h-6 w-6 opacity-40" />
                  </div>
                  <p className="text-sm font-medium">No attendance marked today</p>
                  <p className="text-xs mt-1">
                    Attendance records will appear here once you start marking
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentActivity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/50 border border-transparent hover:border-border"
                    >
                      <Avatar
                        fallback={item.student_detail ? item.student_detail.name.split(" ").map((n: string) => n[0]).join("") : "?"}
                        className="h-9 w-9 bg-primary/10 text-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {item.student_detail?.name || item.student}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.verification_log ? `Match: ${(item.verification_log.face_confidence * 100).toFixed(0)}%` : "Auto-marked"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge
                          variant={
                            item.status === "PRESENT" ? "success" : "destructive"
                          }
                          className="text-[10px] px-1.5 py-0"
                        >
                          {item.status}
                        </Badge>
                        <p className="mt-1 text-[10px] text-muted-foreground font-mono">
                          {new Date(item.marked_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Today's Classes ── */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class / Session</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingSessions ? (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : todayClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24">
                      <div className="flex flex-col items-center justify-center h-full">
                        <Calendar className="h-8 w-8 text-muted-foreground/40 mb-2" />
                        <p className="text-sm text-muted-foreground">No classes scheduled for today.</p>
                        <p className="text-xs text-muted-foreground mt-1">Check back tomorrow for your schedule</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  todayClasses.map((cls) => {
                    let status = "Upcoming";
                    let badgeVariant: "secondary" | "success" | "warning" = "secondary";
                    
                    if (cls.end_time < currentTimeString) {
                      status = "Ended";
                    } else if (cls.start_time <= currentTimeString && cls.end_time >= currentTimeString) {
                      status = "In Progress";
                      badgeVariant = "success";
                    } else {
                      badgeVariant = "warning";
                    }

                    return (
                      <TableRow key={cls.id}>
                        <TableCell className="font-medium">
                          {cls.class_name}
                          <span className="block text-xs text-muted-foreground font-normal mt-0.5">{cls.subject_name} ({cls.subject_code})</span>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {formatTime12Hour(cls.start_time)} - {formatTime12Hour(cls.end_time)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={badgeVariant}>
                            {status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
