"use client";

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
} from "lucide-react";

/* ─── Static Data ─── */
const stats = [
  { label: "Today's Classes", value: "4", icon: BookOpen, color: "bg-primary/10 text-primary" },
  { label: "Active Session", value: "CS101", icon: Play, color: "bg-emerald-50 text-emerald-600" },
  { label: "Students Present", value: "32", icon: Users, color: "bg-amber-50 text-amber-600" },
  { label: "Attendance Rate", value: "89%", icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
];

const recentActivity = [
  { time: "09:15 AM", student: "Alice Johnson", status: "Present", confidence: "98.2%" },
  { time: "09:14 AM", student: "Bob Williams",  status: "Present", confidence: "97.5%" },
  { time: "09:12 AM", student: "Charlie Brown",  status: "Late",    confidence: "95.1%" },
  { time: "09:10 AM", student: "Diana Ross",     status: "Present", confidence: "99.1%" },
  { time: "09:08 AM", student: "Ethan Hunt",     status: "Present", confidence: "96.7%" },
];

const todayClasses = [
  { class: "CS101 — Intro to CS",        time: "09:00 AM", room: "Room 201", students: 36, status: "In Progress" },
  { class: "CS401 — Machine Learning",   time: "11:00 AM", room: "Room 305", students: 28, status: "Upcoming" },
  { class: "CS101 — Lab Session",        time: "02:00 PM", room: "Lab 3",    students: 36, status: "Upcoming" },
  { class: "CS401 — ML Lab",             time: "04:00 PM", room: "Lab 1",    students: 28, status: "Upcoming" },
];

export default function TeacherDashboardPage() {
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
                    <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Camera Feed + Recent ── */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Camera Feed Placeholder */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Camera Feed</CardTitle>
                <Badge variant="success" className="gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative flex aspect-video items-center justify-center rounded-xl bg-linear-to-br from-slate-800 to-slate-900 overflow-hidden">
                {/* Scanline animation overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-size-[100%_4px]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
                  <Camera className="h-12 w-12 mb-3" />
                  <p className="text-lg font-semibold">Camera Feed Placeholder</p>
                  <p className="text-sm text-white/40 mt-1">Face recognition active — CS101</p>
                </div>
                {/* Corner markers */}
                <div className="absolute top-4 left-4 h-8 w-8 border-l-2 border-t-2 border-primary rounded-tl-lg" />
                <div className="absolute top-4 right-4 h-8 w-8 border-r-2 border-t-2 border-primary rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 h-8 w-8 border-l-2 border-b-2 border-primary rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 h-8 w-8 border-r-2 border-b-2 border-primary rounded-br-lg" />
              </div>
              <div className="mt-4 flex gap-3">
                <Button size="sm" className="flex-1">
                  <Play className="h-4 w-4" />
                  Start Session
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <CheckCircle2 className="h-4 w-4" />
                  End Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Recognitions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Recognitions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary text-xs font-semibold">
                    {item.student.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.student}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Confidence: {item.confidence}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge
                      variant={
                        item.status === "Present" ? "success" : item.status === "Late" ? "warning" : "destructive"
                      }
                    >
                      {item.status}
                    </Badge>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Today's Classes ── */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayClasses.map((cls, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{cls.class}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {cls.time}
                    </TableCell>
                    <TableCell>{cls.room}</TableCell>
                    <TableCell>{cls.students}</TableCell>
                    <TableCell>
                      <Badge
                        variant={cls.status === "In Progress" ? "success" : "secondary"}
                      >
                        {cls.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
