"use client";

import React from "react";
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
  Pause,
  Timer,
  ChevronDown,
  ShieldAlert,
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
  const [subject, setSubject] = React.useState("CS101");
  const [classId, setClassId] = React.useState("CS101-A");
  const [sessionState, setSessionState] = React.useState<
    "idle" | "running" | "paused" | "ended"
  >("idle");

  const present = recognizedStudents.filter((s) => s.status === "Present").length;
  const late = recognizedStudents.filter((s) => s.status === "Late").length;
  const absent = recognizedStudents.filter((s) => s.status === "Absent").length;

  const lowConfidence = recognizedStudents.filter(
    (s) => s.confidence > 0 && s.confidence < 95
  ).length;
  const unknownFaces = 2;

  const sessionBadge =
    sessionState === "running"
      ? { variant: "success" as const, label: "Running" }
      : sessionState === "paused"
      ? { variant: "warning" as const, label: "Paused" }
      : sessionState === "ended"
      ? { variant: "secondary" as const, label: "Ended" }
      : { variant: "secondary" as const, label: "Idle" };

  return (
    <>
      <TopNavbar title="Attendance" userInitials="SW" />
      <div className="p-6 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                Take Attendance
              </h1>
              <Badge variant={sessionBadge.variant} className="h-6">
                {sessionBadge.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Select a subject and class, then start a session to begin live
              recognition.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSessionState("idle")}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button
              size="sm"
              disabled={sessionState !== "ended"}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Submit Attendance
            </Button>
          </div>
        </div>

        {/* ── Step 1: Select Subject/Class ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1) Select subject and class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Subject
                </span>
                <div className="relative">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="CS101">CS101 — Intro to CS</option>
                    <option value="CS401">CS401 — Machine Learning</option>
                    <option value="MATH201">MATH201 — Linear Algebra</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Class / Section
                </span>
                <div className="relative">
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="CS101-A">Section A · Room 201 · 09:00</option>
                    <option value="CS101-B">Section B · Room 202 · 11:00</option>
                    <option value="CS401-B">Section B · Room 305 · 11:00</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </label>
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Session
                </span>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    disabled={sessionState === "running"}
                    onClick={() => setSessionState("running")}
                  >
                    <Play className="h-4 w-4" />
                    Start
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={sessionState !== "running"}
                    onClick={() => setSessionState("paused")}
                  >
                    <Pause className="h-4 w-4" />
                    Pause
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5" />
                Session time: 12:34 (mock)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5" />
                Camera permissions required on first run
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono">
                {subject} · {classId}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ── Session Stats ── */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
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

        {/* ── Review queue (mock) ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Low-confidence</p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {lowConfidence}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Suggested manual review
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Unknown faces</p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {unknownFaces}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Needs matching or ignore
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Session status</p>
              <p className="mt-1 text-3xl font-bold text-primary">
                {sessionBadge.label}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={sessionState !== "paused"}
                  onClick={() => setSessionState("running")}
                >
                  <Play className="h-4 w-4" />
                  Resume
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  disabled={sessionState === "idle" || sessionState === "ended"}
                  onClick={() => setSessionState("ended")}
                >
                  <Square className="h-4 w-4" />
                  End
                </Button>
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
              <div className="relative flex aspect-video items-center justify-center rounded-xl bg-linear-to-br from-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-size-[100%_4px]" />

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
                  <Camera className="h-10 w-10 mb-2" />
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
