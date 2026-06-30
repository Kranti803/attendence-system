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
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

import { useClassSessions } from "@/hooks/useClassSession";
import { useTeacherAttendance } from "@/hooks/useAttendance";

export default function TeacherDashboardPage() {
  const router = useRouter();
  
  const { data: classSessions = [], isLoading: isLoadingSessions } = useClassSessions();
  const { data: attendanceRecords = [], isLoading: isLoadingAttendance } = useTeacherAttendance();

  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const currentTimeString = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });

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
      <TopNavbar title="Dashboard" userInitials="SW" />
      <div className="p-6 space-y-6">
        {/* ── Stats Cards ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {isLoadingSessions || isLoadingAttendance ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : stat.value}
                    </p>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center px-4">
                  <Users className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">No attendance marked today.</p>
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
                          {new Date(item.marked_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
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
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                        <span className="text-muted-foreground">Loading schedule...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : todayClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <p className="text-muted-foreground">No classes scheduled for today.</p>
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
                          {cls.start_time.slice(0, 5)} - {cls.end_time.slice(0, 5)}
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
