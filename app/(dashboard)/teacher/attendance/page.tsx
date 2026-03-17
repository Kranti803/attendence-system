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
import { Avatar } from "@/components/ui/avatar";
import {
  Camera,
  Play,
  Square,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Users,
} from "lucide-react";

/* ─── Static Data ─── */
const recognizedStudents = [
  { id: "STU001", name: "Alice Johnson",   time: "09:02 AM", status: "Present",  confidence: 98.2 },
  { id: "STU002", name: "Bob Williams",    time: "09:03 AM", status: "Present",  confidence: 97.5 },
  { id: "STU003", name: "Charlie Brown",   time: "09:07 AM", status: "Late",     confidence: 95.1 },
  { id: "STU004", name: "Diana Ross",      time: "09:01 AM", status: "Present",  confidence: 99.1 },
  { id: "STU005", name: "Ethan Hunt",      time: "09:04 AM", status: "Present",  confidence: 96.7 },
  { id: "STU006", name: "Fiona Apple",     time: "—",        status: "Absent",   confidence: 0 },
  { id: "STU007", name: "George Lucas",    time: "09:06 AM", status: "Present",  confidence: 94.8 },
  { id: "STU008", name: "Hannah Montana",  time: "—",        status: "Absent",   confidence: 0 },
  { id: "STU009", name: "Ivan Drago",      time: "09:05 AM", status: "Present",  confidence: 97.3 },
  { id: "STU010", name: "Julia Roberts",   time: "—",        status: "Absent",   confidence: 0 },
];

export default function TeacherAttendancePage() {
  const present = recognizedStudents.filter((s) => s.status === "Present").length;
  const late = recognizedStudents.filter((s) => s.status === "Late").length;
  const absent = recognizedStudents.filter((s) => s.status === "Absent").length;

  return (
    <>
      <TopNavbar title="Attendance" userInitials="SW" />
      <div className="p-6 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Take Attendance
            </h1>
            <p className="text-sm text-muted-foreground">
              CS101 — Introduction to Computer Science · Room 201
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button size="sm" variant="success">
              <CheckCircle2 className="h-4 w-4" />
              Submit Attendance
            </Button>
          </div>
        </div>

        {/* ── Session Stats ── */}
        <div className="grid gap-4 sm:grid-cols-4 stagger-children">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold">{recognizedStudents.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Present</p>
                <p className="text-lg font-bold text-emerald-600">{present}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Late</p>
                <p className="text-lg font-bold text-amber-600">{late}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Absent</p>
                <p className="text-lg font-bold text-red-600">{absent}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Camera + Student List ── */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Camera Feed */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Camera Feed</CardTitle>
                <Badge variant="success" className="gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Recording
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px]" />

                {/* Sample face detection boxes */}
                <div className="absolute top-[20%] left-[25%] h-16 w-14 border-2 border-emerald-400 rounded-md">
                  <span className="absolute -top-5 left-0 whitespace-nowrap rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Alice J. — 98.2%
                  </span>
                </div>
                <div className="absolute top-[22%] left-[50%] h-16 w-14 border-2 border-emerald-400 rounded-md">
                  <span className="absolute -top-5 left-0 whitespace-nowrap rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Bob W. — 97.5%
                  </span>
                </div>
                <div className="absolute top-[30%] right-[20%] h-16 w-14 border-2 border-amber-400 rounded-md">
                  <span className="absolute -top-5 left-0 whitespace-nowrap rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Charlie B. — 95.1%
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center text-white/40 z-10">
                  <Camera className="h-10 w-10 mb-2 animate-pulse-soft" />
                  <p className="text-sm font-medium">Face Recognition Active</p>
                </div>

                {/* Corner markers */}
                <div className="absolute top-3 left-3 h-6 w-6 border-l-2 border-t-2 border-primary/60 rounded-tl" />
                <div className="absolute top-3 right-3 h-6 w-6 border-r-2 border-t-2 border-primary/60 rounded-tr" />
                <div className="absolute bottom-3 left-3 h-6 w-6 border-l-2 border-b-2 border-primary/60 rounded-bl" />
                <div className="absolute bottom-3 right-3 h-6 w-6 border-r-2 border-b-2 border-primary/60 rounded-br" />
              </div>
              <div className="mt-4 flex gap-3">
                <Button size="sm" variant="destructive" className="flex-1">
                  <Square className="h-4 w-4" />
                  Stop Recording
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="h-4 w-4" />
                  Switch Camera
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recognized Students List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student List</CardTitle>
                <Badge variant="secondary">
                  {present + late}/{recognizedStudents.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="max-h-[520px] overflow-y-auto space-y-2">
              {recognizedStudents.map((student) => (
                <div
                  key={student.id}
                  className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors ${
                    student.status === "Absent"
                      ? "bg-red-50/50"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Avatar
                    fallback={student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {student.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {student.id}
                      {student.confidence > 0 && ` · ${student.confidence}%`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge
                      variant={
                        student.status === "Present"
                          ? "success"
                          : student.status === "Late"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {student.status}
                    </Badge>
                    {student.time !== "—" && (
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {student.time}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
