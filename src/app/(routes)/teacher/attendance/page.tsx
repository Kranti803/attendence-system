"use client";

import React from "react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Play,
  Square,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Users,
  Timer,
  ChevronDown,
  ShieldAlert,
  Loader2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import {
  useClassSessions,
  useCreateClassSession,
} from "@/hooks/useClassSession";
import { useSubjects } from "@/hooks/useSubject";
import {
  useSessionSummary,
  useClassAttendance,
  useStartAttendanceSession,
  useEndAttendanceSession,
} from "@/hooks/useAttendance";
import {
  useMyTemplates,
  useCreateTemplate,
} from "@/hooks/useClassSessionTemplate";
import { AttendanceSessionEndResponse } from "@/types/attendance";
import { CreateClassSessionTemplatePayload } from "@/types/classSessionTemplate";

const EMPTY_TEMPLATE_FORM: CreateClassSessionTemplatePayload = {
  subject: "",
  day_of_week: 0,
  start_time: "09:00",
  end_time: "10:00",
  max_attendance_marking_minutes: 15,
  is_active: true,
};

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TeacherAttendancePage() {
  // ── Template/Session selection ──────────────────────────────────────────
  const [selectedTemplateId, setSelectedTemplateId] = React.useState("");
  const [sessionState, setSessionState] = React.useState<"idle" | "running" | "ended">("idle");

  // ── Live attendance session ───────────────────────────────────────────────
  const [liveSessionId, setLiveSessionId] = React.useState<string | null>(null);
  const [sessionSummaryData, setSessionSummaryData] = React.useState<AttendanceSessionEndResponse['summary'] | null>(null);

  // ── Create template dialog ────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = React.useState(false);
  const [templateForm, setTemplateForm] = React.useState(EMPTY_TEMPLATE_FORM);

  // ── Elapsed timer ─────────────────────────────────────────────────────────
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Data hooks ────────────────────────────────────────────────────────────
  const { data: myTemplates = [], isLoading: isLoadingTemplates } = useMyTemplates();
  const { data: subjects = [], isLoading: isLoadingSubjects } = useSubjects();
  const { mutate: createTemplate, isPending: isCreatingTemplate } = useCreateTemplate();

  const isSessionLive = sessionState === "running";

  const { data: sessionSummary } = useSessionSummary(
    selectedTemplateId || null,
    isSessionLive,
  );

  const { data: classAttendance = [], isLoading: isLoadingAttendance } =
    useClassAttendance(selectedTemplateId || null);

  const { mutate: startSession, isPending: isStartingSession } = useStartAttendanceSession();
  const { mutate: endSession, isPending: isEndingSession } = useEndAttendanceSession();

  // ── Helpers ───────────────────────────────────────────────────────────────
  const selectedTemplate = myTemplates.find((t) => t.id === selectedTemplateId);

  const subjectName = (id: string) => {
    const s = subjects.find((sub) => sub.id === id);
    return s ? `${s.name} (${s.code})` : "";
  };

  const formatElapsed = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ── Dynamic Stats ────────────────────────────────────────────────────────
  const total = sessionSummary?.total_students ?? sessionSummaryData?.total_students ?? 0;
  const present = sessionSummary?.present ?? sessionSummaryData?.present ?? 0;
  const absent = sessionSummary?.absent ?? sessionSummaryData?.absent ?? 0;
  const attendanceRate = total > 0 ? (present / total) * 100 : 0;

  // ── Session lifecycle ─────────────────────────────────────────────────────
  const handleStartSession = async () => {
    if (!selectedTemplateId) {
      toast.error("Please select a recurring class first.");
      return;
    }

    startSession(selectedTemplateId, {
      onSuccess: (response) => {
        setLiveSessionId(response.id);
        setSessionSummaryData(null);
        setElapsedSeconds(0);
        setSessionState("running");

        toast.success("Live session started! Students can now mark attendance.");

        timerRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to start session");
      },
    });
  };

  const handleEndSession = () => {
    if (!liveSessionId) {
      setSessionState("ended");
      if (timerRef.current) clearInterval(timerRef.current);
      toast.success("Attendance session ended.");
      return;
    }

    endSession(liveSessionId, {
      onSuccess: (response) => {
        setSessionSummaryData(response.summary);
        setLiveSessionId(null);
        setSessionState("ended");
        if (timerRef.current) clearInterval(timerRef.current);
        if (response?.summary) {
          toast.success(`Session ended! ${response.summary.present} present, ${response.summary.absent} absent (${response.summary.attendance_rate.toFixed(1)}%)`);
        } else {
          toast.success("Session ended!");
        }
      },
      onError: (err) => {
        toast.error(err.message || "Failed to end session");
        setSessionState("ended");
        if (timerRef.current) clearInterval(timerRef.current);
      },
    });
  };

  const handleReset = () => {
    setSessionState("idle");
    setLiveSessionId(null);
    setSessionSummaryData(null);
    setElapsedSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Create template handler ───────────────────────────────────────────────
  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    createTemplate(templateForm, {
      onSuccess: (newTemplate) => {
        setSelectedTemplateId(newTemplate.id);
        setCreateOpen(false);
        setTemplateForm(EMPTY_TEMPLATE_FORM);
        toast.success("Recurring class created! You can now start sessions for it.");
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleTemplateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTemplateForm((prev) => ({
      ...prev,
      [name]: name === "day_of_week" ? parseInt(value) : value,
    }));
  };

  // ── UI Badges ──────────────────────────────────────────────────────────────
  const sessionBadge =
    sessionState === "running"
      ? { variant: "success" as const, label: "Live", dot: true }
      : sessionState === "ended"
        ? { variant: "secondary" as const, label: "Ended", dot: false }
        : { variant: "outline" as const, label: "Ready", dot: false };

  return (
    <>
      <TopNavbar title="Attendance" userInitials="SW" />
      <div className="p-6 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Command Center
              </h1>
              <Badge variant={sessionBadge.variant} className="h-6 gap-1.5 px-2.5">
                {sessionBadge.dot && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                )}
                {sessionBadge.label}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Select a recurring class and start the live feed to capture attendance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset View
            </Button>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button disabled={sessionState !== "idle"}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <form onSubmit={handleCreateTemplate}>
                  <DialogHeader>
                    <DialogTitle>Create Recurring Class</DialogTitle>
                    <DialogDescription>
                      Create a recurring class template (e.g., "Monday 9-10 AM"). Sessions will automatically be available for this schedule.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 grid gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Subject <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="subject"
                          value={templateForm.subject}
                          onChange={handleTemplateFormChange}
                          required
                          className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="" disabled>
                            {isLoadingSubjects ? "Loading…" : "Select subject…"}
                          </option>
                          {subjects.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.code})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Day of Week <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="day_of_week"
                          value={templateForm.day_of_week}
                          onChange={handleTemplateFormChange}
                          className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                          {DAY_NAMES.map((day, index) => (
                            <option key={index} value={index}>
                              {day}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Start Time <span className="text-destructive">*</span>
                        </label>
                        <Input
                          name="start_time"
                          type="time"
                          value={templateForm.start_time}
                          onChange={handleTemplateFormChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          End Time <span className="text-destructive">*</span>
                        </label>
                        <Input
                          name="end_time"
                          type="time"
                          value={templateForm.end_time}
                          onChange={handleTemplateFormChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isCreatingTemplate}>
                      {isCreatingTemplate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Template
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── Active Session Selector / Controls ── */}
        {sessionState === "idle" && (
          <Card className="border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full relative">
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-input bg-background px-4 pr-10 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="" disabled>
                    {isLoadingTemplates
                      ? "Loading templates…"
                      : myTemplates.length === 0
                        ? "No templates — please create one"
                        : "Select a recurring class…"}
                  </option>
                  {myTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.subject_code} · {template.day_of_week_display} {template.start_time.slice(0, 5)}-{template.end_time.slice(0, 5)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={!selectedTemplateId || isStartingSession}
                onClick={handleStartSession}
              >
                {isStartingSession ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Play className="mr-2 h-5 w-5 fill-current" />}
                Start Session
              </Button>
            </CardContent>
          </Card>
        )}

        {sessionState === "running" && (
          <Card className="border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30">
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-700">Session is live and collecting attendance</p>
                <p className="text-xs text-emerald-600 mt-1">Students can now mark their attendance</p>
              </div>
              <Button
                variant="destructive"
                size="lg"
                onClick={handleEndSession}
                disabled={isEndingSession}
              >
                {isEndingSession ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Square className="mr-2 h-5 w-5 fill-current" />}
                End Session
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Dynamic Stats Row ── */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card">
            <CardContent className="p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Users className="h-4 w-4" />
                <p className="text-sm font-medium">Total Enrolled</p>
              </div>
              <p className="text-3xl font-bold tracking-tight">{total}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50">
            <CardContent className="p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 mb-3">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-sm font-medium">Present</p>
              </div>
              <p className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {present}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50">
            <CardContent className="p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-500 mb-3">
                <XCircle className="h-4 w-4" />
                <p className="text-sm font-medium">Absent</p>
              </div>
              <p className="text-3xl font-bold tracking-tight text-red-600 dark:text-red-400">
                {absent}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50">
            <CardContent className="p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 mb-3">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-sm font-medium">Attendance Rate</p>
              </div>
              <p className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                {attendanceRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Main Layout Split ── */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left Column: Session Info & Controls */}
          <div className="lg:col-span-3 space-y-4">
            {/* Session Status Card */}
            <Card className="overflow-hidden border-2 border-muted shadow-md bg-gradient-to-br from-primary/5 to-primary/2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Session Status</CardTitle>
                    <CardDescription>
                      {sessionState === "idle"
                        ? "Ready to start"
                        : sessionState === "running"
                        ? "Live attendance collection"
                        : "Session completed"}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      sessionState === "running"
                        ? "success"
                        : sessionState === "ended"
                        ? "secondary"
                        : "outline"
                    }
                    className="h-6 gap-1.5 px-2.5"
                  >
                    {sessionState === "running" && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                    )}
                    {sessionState === "idle" ? "Idle" : sessionState === "running" ? "Live" : "Ended"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTemplate && (
                  <div className="space-y-2 p-3 rounded-lg bg-background/50 border">
                    <p className="text-sm font-medium text-foreground">
                      {selectedTemplate.subject_code} - {selectedTemplate.subject_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedTemplate.day_of_week_display} • {selectedTemplate.start_time.slice(0, 5)}-{selectedTemplate.end_time.slice(0, 5)}
                    </p>
                  </div>
                )}

                {sessionState === "running" && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
                    <Timer className="h-4 w-4 text-blue-600 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-600">Elapsed Time</p>
                      <p className="text-lg font-mono font-bold text-blue-700">{formatElapsed(elapsedSeconds)}</p>
                    </div>
                  </div>
                )}

                {sessionState === "ended" && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <p className="text-sm text-emerald-700 font-medium">Session completed and recorded</p>
                  </div>
                )}

                {sessionState === "idle" && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                    <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                    <p className="text-sm text-amber-700">Select a session to begin</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Warning - No Camera Access */}
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <p>Real-time attendance is collected automatically. Students mark attendance through their mobile app.</p>
            </div>
          </div>

          {/* Right Column: Dynamic Student List */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col shadow-sm border-muted">
              <CardHeader className="py-4 border-b bg-muted/20 shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    {sessionState === "running" ? "Live Detections" : "Attendance Roster"}
                  </CardTitle>
                  <Badge variant="secondary" className="font-mono">
                    {present}/{total}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-y-auto">
                <div className="p-3 space-y-2">
                  
                  {/* Empty State */}
                  {sessionState === "idle" && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                      <Users className="h-10 w-10 mb-3 opacity-20" />
                      <p className="text-sm">Roster will appear here when a session is active or ended.</p>
                    </div>
                  )}

                  {/* Loading State for Ended Session */}
                  {sessionState === "ended" && isLoadingAttendance && (
                    <div className="flex items-center justify-center p-6 h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
                    </div>
                  )}

                  {/* Running - Live attendance view */}
                  {sessionState === "running" && !isLoadingAttendance && classAttendance.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                      <Users className="h-8 w-8 opacity-20 mb-3" />
                      <p className="text-sm font-medium">Waiting for students...</p>
                      <p className="text-xs opacity-70 mt-1">Students will appear as they mark attendance</p>
                    </div>
                  )}

                  {sessionState === "running" && classAttendance.map((record) => {
                    const isPresent = record.status === "PRESENT";
                    return (
                      <div
                        key={record.id}
                        className={`flex items-center gap-3 rounded-lg p-2.5 border transition-all animate-in slide-in-from-top-2 fade-in duration-300 ${
                          isPresent
                            ? "bg-background shadow-xs hover:border-emerald-200"
                            : "bg-red-50/30 border-red-100 dark:bg-red-950/10 dark:border-red-900/30"
                        }`}
                      >
                        <Avatar
                          fallback={record.student_detail ? record.student_detail.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2) : "?"}
                          className={`h-9 w-9 border-2 ${isPresent ? "border-emerald-100 text-emerald-700 bg-emerald-50" : "border-red-100 text-red-700 bg-red-50"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`truncate text-sm font-semibold ${isPresent ? "text-foreground" : "text-foreground/80"}`}>
                            {record.student_detail?.name || record.student}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {record.verification_log
                              ? `${(record.verification_log.face_confidence * 100).toFixed(0)}% confidence`
                              : "Marked"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 inline-block ${
                            isPresent ? "text-emerald-700 bg-emerald-100" : "text-red-700 bg-red-100"
                          }`}>
                            {record.status}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(record.marked_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Ended View (shows all students) */}
                  {sessionState === "ended" && !isLoadingAttendance && classAttendance.map((record) => {
                    const isPresent = record.status === "PRESENT";
                    return (
                      <div
                        key={record.id}
                        className={`flex items-center gap-3 rounded-lg p-2.5 border transition-all ${
                          isPresent
                            ? "bg-background shadow-xs hover:border-emerald-200"
                            : "bg-red-50/30 border-red-100 dark:bg-red-950/10 dark:border-red-900/30"
                        }`}
                      >
                        <Avatar
                          fallback={record.student_detail ? record.student_detail.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2) : "?"}
                          className={`h-9 w-9 border-2 ${isPresent ? "border-emerald-100 text-emerald-700 bg-emerald-50" : "border-red-100 text-red-700 bg-red-50"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`truncate text-sm font-semibold ${isPresent ? "text-foreground" : "text-foreground/80"}`}>
                            {record.student_detail?.name || record.student}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {record.verification_log
                              ? `Verified • ${(record.verification_log.face_confidence * 100).toFixed(0)}% match`
                              : "Auto-marked"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 inline-block ${
                            isPresent ? "text-emerald-700 bg-emerald-100" : "text-red-700 bg-red-100"
                          }`}>
                            {record.status}
                          </p>
                          <p className="text-[10px] text-muted-foreground block">
                            {new Date(record.marked_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
