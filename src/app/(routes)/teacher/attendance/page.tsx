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
  Camera,
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
import { useAttendanceStream, useAttendanceCameraStream } from "@/hooks/useAttendanceStream";
import { DetectedStudent, AttendanceSessionEndResponse, FaceOverlay } from "@/types/attendance";

const EMPTY_SESSION_FORM = {
  class_name: "",
  subject: "",
  date: new Date().toISOString().split("T")[0],
  start_time: "",
  end_time: "",
};

export default function TeacherAttendancePage() {
  // ── Session selection ─────────────────────────────────────────────────────
  const [selectedSessionId, setSelectedSessionId] = React.useState("");
  const [sessionState, setSessionState] = React.useState<"idle" | "running" | "ended">("idle");

  // ── Live attendance session ───────────────────────────────────────────────
  const [liveSessionId, setLiveSessionId] = React.useState<string | null>(null);
  const [liveDetectedStudents, setLiveDetectedStudents] = React.useState<DetectedStudent[]>([]);
  const [sessionSummaryData, setSessionSummaryData] = React.useState<AttendanceSessionEndResponse['summary'] | null>(null);

  // ── Create session dialog ─────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = React.useState(false);
  const [sessionForm, setSessionForm] = React.useState(EMPTY_SESSION_FORM);

  // ── Camera ────────────────────────────────────────────────────────────────
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = React.useState(false);
  const facesRef = React.useRef<FaceOverlay[]>([]);

  // ── Elapsed timer ─────────────────────────────────────────────────────────
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Data hooks ────────────────────────────────────────────────────────────
  const { data: classSessions = [], isLoading: isLoadingSessions } = useClassSessions();
  const { data: subjects = [], isLoading: isLoadingSubjects } = useSubjects();
  const { mutate: createClassSession, isPending: isCreatingSession } = useCreateClassSession();

  const isSessionLive = sessionState === "running";

  const { data: sessionSummary } = useSessionSummary(
    selectedSessionId || null,
    isSessionLive,
  );

  const { data: classAttendance = [], isLoading: isLoadingAttendance } =
    useClassAttendance(selectedSessionId || null);

  const { mutate: startSession, isPending: isStartingSession } = useStartAttendanceSession();
  const { mutate: endSession, isPending: isEndingSession } = useEndAttendanceSession();

  // WebSocket stream
  const {
    isConnected,
    isConnecting,
    sendFrame,
    faces: wsFaces,
    error: wsError,
  } = useAttendanceStream({
    sessionId: liveSessionId,
    onDetected: (students) => {
      setLiveDetectedStudents((prev) => {
        const newIds = new Set(students.map((s) => s.student_id));
        const filtered = prev.filter((p) => !newIds.has(p.student_id));
        return [...students, ...filtered]; // Prepend newest first
      });
      students.forEach((s) => {
        toast.success(`${s.student_name} detected! (${(s.confidence * 100).toFixed(0)}%)`);
      });
    },
    onConnected: () => {
      toast.success("Live detection connected");
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  // Keep facesRef in sync so the rAF loop always reads the latest data
  React.useEffect(() => {
    facesRef.current = wsFaces;
  }, [wsFaces]);

  // Continuous frame capture — send at 300ms intervals
  useAttendanceCameraStream(videoRef, isCameraActive && sessionState === "running" && !!liveSessionId, sendFrame, 300);

  // ── rAF canvas draw loop — runs at monitor refresh rate for smooth boxes ──
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const draw = () => {
      animId = requestAnimationFrame(draw);

      const faces = facesRef.current;

      // Sync canvas logical size to the video's displayed size
      const { width, height } = video.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isCameraActive || faces.length === 0) return;

      // Video stream size vs canvas size ratio (frames are sent at 480×360)
      const scaleX = canvas.width / 480;
      const scaleY = canvas.height / 360;

      faces.forEach((face: FaceOverlay) => {
        const x = face.x * scaleX;
        const y = face.y * scaleY;
        const w = face.w * scaleX;
        const h = face.h * scaleY;

        const color =
          face.status === "identified"
            ? "#22c55e" // Emerald 500
            : face.status === "ambiguous"
            ? "#eab308" // Yellow 500
            : "#ef4444"; // Red 500

        // Glowing box
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.strokeRect(x, y, w, h);
        ctx.shadowBlur = 0;

        // Translucent fill
        ctx.fillStyle = color + "15"; // Very light fill
        ctx.fillRect(x, y, w, h);

        // Label
        const label =
          face.status === "identified" && face.student_id
            ? "IDENTIFIED"
            : face.status === "ambiguous"
            ? "AMBIGUOUS"
            : "UNKNOWN";

        const fontSize = Math.max(10, Math.round(w * 0.1));
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        const textW = ctx.measureText(label).width;
        const labelH = fontSize + 6;
        const labelY = y > labelH + 4 ? y - labelH - 2 : y + h + 2;

        ctx.fillStyle = color;
        ctx.fillRect(x, labelY, textW + 12, labelH);

        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, x + 6, labelY + fontSize - 1);
      });
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isCameraActive]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const subjectName = (id: string) => {
    const s = subjects.find((sub) => sub.id === id);
    return s ? `${s.name} (${s.code})` : "";
  };

  const selectedSession = classSessions.find((s) => s.id === selectedSessionId);

  const formatElapsed = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ── Dynamic Stats ────────────────────────────────────────────────────────
  const total = sessionSummary?.total_students ?? sessionSummaryData?.total_students ?? 0;
  const present =
    sessionState === "running"
      ? liveDetectedStudents.length
      : (sessionSummary?.present ?? sessionSummaryData?.present ?? 0);
  const absent = sessionState === "running" ? total - present : (sessionSummary?.absent ?? sessionSummaryData?.absent ?? 0);
  const attendanceRate = total > 0 ? (present / total) * 100 : 0;

  // ── Camera controls ───────────────────────────────────────────────────────
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // ── Session lifecycle ─────────────────────────────────────────────────────
  const handleStartSession = async () => {
    if (!selectedSessionId) {
      toast.error("Please select a class session first.");
      return;
    }

    startSession(selectedSessionId, {
      onSuccess: (response) => {
        setLiveSessionId(response.id);
        setLiveDetectedStudents([]);
        setSessionSummaryData(null);
        setElapsedSeconds(0);
        startCamera();
        setSessionState("running");

        toast.success("Live session started!");

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
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
      toast.success("Attendance session ended.");
      return;
    }

    endSession(liveSessionId, {
      onSuccess: (response) => {
        setSessionSummaryData(response.summary);
        setLiveSessionId(null);
        setSessionState("ended");
        stopCamera();
        if (timerRef.current) clearInterval(timerRef.current);
        toast.success(`Session ended! ${response.summary.present} present, ${response.summary.absent} absent (${response.summary.attendance_rate.toFixed(1)}%)`);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to end session");
        setSessionState("ended");
        stopCamera();
        if (timerRef.current) clearInterval(timerRef.current);
      },
    });
  };

  const handleReset = () => {
    setSessionState("idle");
    setLiveSessionId(null);
    setLiveDetectedStudents([]);
    setSessionSummaryData(null);
    setElapsedSeconds(0);
    stopCamera();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Create session handler ────────────────────────────────────────────────
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    createClassSession(sessionForm, {
      onSuccess: (newSession) => {
        setSelectedSessionId(newSession.id);
        setCreateOpen(false);
        setSessionForm(EMPTY_SESSION_FORM);
        toast.success("Class session created! It's now selected.");
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleSessionFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setSessionForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
              Select a class session and start the live feed to capture attendance.
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
                  New Session
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <form onSubmit={handleCreateSession}>
                  <DialogHeader>
                    <DialogTitle>Quick Create Session</DialogTitle>
                    <DialogDescription>
                      Create a new class session to take attendance in.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 grid gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Class Name / Section <span className="text-destructive">*</span>
                      </label>
                      <Input
                        name="class_name"
                        value={sessionForm.class_name}
                        onChange={handleSessionFormChange}
                        placeholder='e.g. "CS101 — Section A"'
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Subject <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="subject"
                          value={sessionForm.subject}
                          onChange={handleSessionFormChange}
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
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Date <span className="text-destructive">*</span>
                        </label>
                        <Input
                          name="date"
                          type="date"
                          value={sessionForm.date}
                          onChange={handleSessionFormChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Time Window <span className="text-destructive">*</span>
                        </label>
                        <div className="flex gap-2">
                          <Input
                            name="start_time"
                            type="time"
                            value={sessionForm.start_time}
                            onChange={handleSessionFormChange}
                            required
                          />
                          <Input
                            name="end_time"
                            type="time"
                            value={sessionForm.end_time}
                            onChange={handleSessionFormChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isCreatingSession}>
                      {isCreatingSession && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create & Select
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── Active Session Selector ── */}
        {sessionState === "idle" && (
          <Card className="border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full relative">
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-input bg-background px-4 pr-10 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="" disabled>
                    {isLoadingSessions
                      ? "Loading sessions…"
                      : classSessions.length === 0
                        ? "No sessions — please create one"
                        : "Select a class session to begin…"}
                  </option>
                  {classSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.class_name} · {subjectName(session.subject)} · {session.date}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={!selectedSessionId || isStartingSession}
                onClick={handleStartSession}
              >
                {isStartingSession ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Play className="mr-2 h-5 w-5 fill-current" />}
                Start Camera
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
          {/* Left Column: Camera & Controls */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="overflow-hidden border-2 border-muted shadow-md">
              <div className="relative aspect-video bg-slate-950">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 h-full w-full"
                  style={{ pointerEvents: "none" }}
                />
                
                {/* Subtle grid overlay for high-tech look */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] pointer-events-none mix-blend-overlay" />
                
                {/* Corner reticles */}
                <div className="absolute top-4 left-4 h-8 w-8 border-l-2 border-t-2 border-white/40 rounded-tl" />
                <div className="absolute top-4 right-4 h-8 w-8 border-r-2 border-t-2 border-white/40 rounded-tr" />
                <div className="absolute bottom-4 left-4 h-8 w-8 border-l-2 border-b-2 border-white/40 rounded-bl" />
                <div className="absolute bottom-4 right-4 h-8 w-8 border-r-2 border-b-2 border-white/40 rounded-br" />

                {/* Empty State / Not Live overlay */}
                {!isCameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white/60">
                    <Camera className="h-12 w-12 mb-3 opacity-50" />
                    <p className="font-medium text-lg tracking-wide">CAMERA OFFLINE</p>
                    <p className="text-sm opacity-60 mt-1">
                      {sessionState === "idle" ? "Select a session and click Start" : "Session has ended"}
                    </p>
                  </div>
                )}
                
                {/* Websocket Connection Status overlay */}
                {isCameraActive && isConnecting && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/10">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Connecting to ML Service...
                  </div>
                )}
              </div>
              
              {/* Controls bar below camera */}
              <div className="bg-muted/30 p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-mono bg-background px-3 py-1.5 rounded-md border shadow-sm">
                    <Timer className="h-4 w-4" />
                    {formatElapsed(elapsedSeconds)}
                  </div>
                  {selectedSession && (
                    <div className="hidden sm:block text-muted-foreground font-medium">
                      {selectedSession.class_name}
                    </div>
                  )}
                </div>

                {sessionState === "running" && (
                  <Button
                    variant="destructive"
                    onClick={handleEndSession}
                    disabled={isEndingSession}
                    className="w-full sm:w-auto font-medium"
                  >
                    {isEndingSession ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Square className="mr-2 h-4 w-4 fill-current" />}
                    End Session
                  </Button>
                )}
              </div>
            </Card>

            {/* Warning when idle */}
            {sessionState === "idle" && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-900/50">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <p>Ensure your browser has camera permissions enabled. Live recognition will use bandwidth.</p>
              </div>
            )}
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

                  {/* Live View (running) */}
                  {sessionState === "running" && liveDetectedStudents.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                      <div className="relative mb-4">
                        <Camera className="h-8 w-8 opacity-20" />
                        <span className="absolute top-0 right-0 h-3 w-3 animate-ping rounded-full bg-emerald-500 opacity-75" />
                      </div>
                      <p className="text-sm font-medium">Scanning for faces...</p>
                      <p className="text-xs opacity-70 mt-1">Students will appear here instantly</p>
                    </div>
                  )}

                  {sessionState === "running" && liveDetectedStudents.map((student, idx) => (
                    <div
                      key={student.student_id}
                      className="flex items-center gap-3 rounded-lg p-2.5 bg-background border shadow-xs animate-in slide-in-from-top-2 fade-in duration-300 hover:border-emerald-200 transition-colors"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {student.student_name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] bg-muted px-1 rounded">{student.student_roll_number}</span>
                          <span>• {(student.confidence * 100).toFixed(0)}% Match</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                          PRESENT
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(student.marked_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}

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
