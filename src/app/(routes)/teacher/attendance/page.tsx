"use client";

import React from "react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Pause,
  Timer,
  ChevronDown,
  ShieldAlert,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import {
  useClassSessions,
  useCreateClassSession,
} from "@/hooks/useClassSession";
import { useSubjects } from "@/hooks/useSubject";
import {
  useMarkAttendance,
  useSessionSummary,
  useClassAttendance,
  useStartAttendanceSession,
  useEndAttendanceSession,
} from "@/hooks/useAttendance";
import { useAttendanceStream, useAttendanceCameraStream } from "@/hooks/useAttendanceStream";
import { AttendanceMarkResponse, DetectedStudent, AttendanceSessionEndResponse, FaceOverlay } from "@/types/attendance";

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
  const [sessionState, setSessionState] = React.useState<
    "idle" | "running" | "paused" | "ended"
  >("idle");

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

  // ── Live recognition results (accumulated during session) ─────────────────
  const [recognizedResults, setRecognizedResults] = React.useState<
    AttendanceMarkResponse[]
  >([]);

  // ── Elapsed timer ─────────────────────────────────────────────────────────
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Data hooks ────────────────────────────────────────────────────────────
  const { data: classSessions = [], isLoading: isLoadingSessions } =
    useClassSessions();
  const { data: subjects = [], isLoading: isLoadingSubjects } = useSubjects();
  const { mutate: createClassSession, isPending: isCreatingSession } =
    useCreateClassSession();

  const isSessionLive = sessionState === "running" || sessionState === "paused";

  const { data: sessionSummary } = useSessionSummary(
    selectedSessionId || null,
    isSessionLive,
  );

  const { data: classAttendance = [], isLoading: isLoadingAttendance } =
    useClassAttendance(selectedSessionId || null);

  const { mutate: markAttendance, isPending: isMarking } = useMarkAttendance();
  const { mutate: startSession, isPending: isStartingSession } = useStartAttendanceSession();
  const { mutate: endSession, isPending: isEndingSession } = useEndAttendanceSession();

  // WebSocket stream
  const {
    isConnected,
    isConnecting,
    sendFrame,
    faces: wsFaces,
    detectedStudents: wsDetectedStudents,
    error: wsError,
  } = useAttendanceStream({
    sessionId: liveSessionId,
    onDetected: (students) => {
      setLiveDetectedStudents((prev) => {
        const newIds = new Set(students.map((s) => s.student_id));
        const filtered = prev.filter((p) => !newIds.has(p.student_id));
        return [...filtered, ...students];
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

  // Continuous frame capture
  useAttendanceCameraStream(videoRef, isCameraActive && sessionState === "running" && !!liveSessionId, sendFrame, 150);

  // ── Canvas face-overlay drawing ───────────────────────────────────────────
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sync canvas logical size to the video's displayed size
    const syncSize = () => {
      const { width, height } = video.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    // Clear when camera is off or no faces
    if (!isCameraActive || wsFaces.length === 0) {
      syncSize();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    syncSize();

    // Video stream size vs canvas size ratio (frames are sent at 640×480)
    const streamW = 640;
    const streamH = 480;
    const scaleX = canvas.width / streamW;
    const scaleY = canvas.height / streamH;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    wsFaces.forEach((face: FaceOverlay) => {
      const x = face.x * scaleX;
      const y = face.y * scaleY;
      const w = face.w * scaleX;
      const h = face.h * scaleY;

      // Choose colour
      const color =
        face.status === "identified"
          ? "#22c55e"   // green-500
          : face.status === "ambiguous"
          ? "#eab308"   // yellow-500
          : "#ef4444";  // red-500

      // Box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.strokeRect(x, y, w, h);
      ctx.shadowBlur = 0;

      // Semi-transparent fill for subtle depth
      ctx.fillStyle = color + "22";
      ctx.fillRect(x, y, w, h);

      // Label background + text
      const label =
        face.status === "identified" && face.student_id
          ? face.student_id.slice(0, 8)
          : face.status === "ambiguous"
          ? "Ambiguous"
          : "Unknown";

      const fontSize = Math.max(11, Math.round(w * 0.12));
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      const textW = ctx.measureText(label).width;
      const labelH = fontSize + 6;
      const labelY = y > labelH + 4 ? y - labelH - 2 : y + h + 2;

      ctx.fillStyle = color;
      ctx.fillRect(x, labelY, textW + 12, labelH);

      ctx.fillStyle = "#ffffff";
      ctx.fillText(label, x + 6, labelY + fontSize);
    });
  }, [wsFaces, isCameraActive]);

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

  // ── Stats from summary or accumulated results ────────────────────────────
  const total = sessionSummary?.total_students ?? sessionSummaryData?.total_students ?? 0;
  const present =
    sessionSummary?.present ??
    sessionSummaryData?.present ??
    liveDetectedStudents.length;
  const absent = sessionSummary?.absent ?? sessionSummaryData?.absent ?? 0;
  const attendanceRate = sessionSummary?.attendance_rate ?? sessionSummaryData?.attendance_rate ?? 0;

  const lowConfidence = recognizedResults.filter(
    (r) => r.face_matched && r.confidence < 0.95,
  ).length;
  const unknownFaces = recognizedResults.filter((r) => !r.face_matched).length;

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

    // Start the attendance session via API
    startSession(selectedSessionId, {
      onSuccess: (response) => {
        setLiveSessionId(response.id);
        setLiveDetectedStudents([]);
        setSessionSummaryData(null);
        setRecognizedResults([]);
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

  const handlePauseSession = () => {
    setSessionState("paused");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleResumeSession = () => {
    setSessionState("running");
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleEndSession = () => {
    if (!liveSessionId) {
      setSessionState("ended");
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
      toast.success("Attendance session ended.");
      return;
    }

    // End the session via API (auto-marks absentees)
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
    setRecognizedResults([]);
    setElapsedSeconds(0);
    stopCamera();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ── Cleanup on unmount ────────────────────────────────────────────────────
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

  // ── Session badge ─────────────────────────────────────────────────────────
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
              Select a class session, then start a session to begin live face
              recognition.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={sessionState !== "idle"}
                >
                  <Plus className="h-4 w-4" />
                  New Session
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
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
                        Class Name / Section{" "}
                        <span className="text-destructive">*</span>
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
                    <div className="grid gap-4 sm:grid-cols-3">
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
                          Start <span className="text-destructive">*</span>
                        </label>
                        <Input
                          name="start_time"
                          type="time"
                          value={sessionForm.start_time}
                          onChange={handleSessionFormChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          End <span className="text-destructive">*</span>
                        </label>
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
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isCreatingSession}>
                      {isCreatingSession && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create & Select
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── Step 1: Select Class Session ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              1) Select class session and start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="relative">
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  disabled={sessionState !== "idle"}
                  className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  <option value="" disabled>
                    {isLoadingSessions
                      ? "Loading sessions…"
                      : classSessions.length === 0
                        ? "No sessions — create one from the header"
                        : "Select a class session…"}
                  </option>
                  {classSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.class_name} · {subjectName(session.subject)} ·{" "}
                      {session.date} · {session.start_time?.slice(0, 5)} –{" "}
                      {session.end_time?.slice(0, 5)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Session
                </span>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    disabled={sessionState === "running" || !selectedSessionId}
                    onClick={
                      sessionState === "paused"
                        ? handleResumeSession
                        : handleStartSession
                    }
                  >
                    <Play className="h-4 w-4" />
                    {sessionState === "paused" ? "Resume" : "Start"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={sessionState !== "running"}
                    onClick={handlePauseSession}
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
                Session time: {formatElapsed(elapsedSeconds)}
              </span>
              {sessionState === "idle" && (
                <span className="inline-flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Camera permissions required on first run
                </span>
              )}
              {selectedSession && (
                <span className="inline-flex items-center gap-1.5 font-mono">
                  {selectedSession.class_name} · {selectedSession.date}
                </span>
              )}
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
                <p className="text-lg font-bold">{total}</p>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Absent</p>
                <p className="text-lg font-bold text-red-600">{absent}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rate</p>
                <p className="text-lg font-bold text-blue-600">
                  {attendanceRate.toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Review queue ── */}
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
                  onClick={handleResumeSession}
                >
                  <Play className="h-4 w-4" />
                  Resume
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  disabled={sessionState === "idle" || sessionState === "ended"}
                  onClick={handleEndSession}
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
                {isCameraActive && (
                  <Badge variant="success" className="gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Live
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative flex aspect-video items-center justify-center rounded-xl bg-linear-to-br from-slate-800 to-slate-900 overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Face detection canvas overlay */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 h-full w-full"
                  style={{ pointerEvents: "none" }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-size-[100%_4px]" />

                {/* Overlay when capturing */}
                {(isMarking) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm z-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                )}

                {/* Placeholder when camera is off */}
                {!isCameraActive && (
                  <div className="flex flex-col items-center justify-center text-white/40 z-10">
                    <Camera className="h-10 w-10 mb-2" />
                    <p className="text-sm font-medium">
                      {sessionState === "idle"
                        ? "Start a session to activate camera"
                        : "Camera inactive"}
                    </p>
                  </div>
                )}

                {/* Corner markers */}
                <div className="absolute top-3 left-3 h-6 w-6 border-l-2 border-t-2 border-primary/60 rounded-tl" />
                <div className="absolute top-3 right-3 h-6 w-6 border-r-2 border-t-2 border-primary/60 rounded-tr" />
                <div className="absolute bottom-3 left-3 h-6 w-6 border-l-2 border-b-2 border-primary/60 rounded-bl" />
                <div className="absolute bottom-3 right-3 h-6 w-6 border-r-2 border-b-2 border-primary/60 rounded-br" />
              </div>

              <div className="mt-4 flex gap-3">
                {sessionState === "running" && liveSessionId && (
                  <div className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm">
                    {isConnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isConnected ? (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        Live Streaming Active
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4" />
                        Camera Ready (waiting for stream...)
                      </>
                    )}
                  </div>
                )}
                {sessionState !== "running" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    disabled={sessionState === "idle" || sessionState === "ended"}
                    onClick={handleEndSession}
                  >
                    <Square className="h-4 w-4" />
                    End Session
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Student List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student List</CardTitle>
                <Badge variant="secondary">
                  {present}/{total || classAttendance.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="max-h-[520px] overflow-y-auto space-y-2">
              {/* Show live detected students from WebSocket */}
              {liveDetectedStudents.length > 0 && (
                <>
                  <p className="text-xs font-medium text-muted-foreground px-2">
                    LIVE DETECTED
                  </p>
                  {liveDetectedStudents.map((student) => (
                    <div
                      key={student.student_id}
                      className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {student.student_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Roll: {student.student_roll_number} · {(student.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="success">PRESENT</Badge>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {new Date(student.marked_at).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Show legacy manual capture results */}
              {recognizedResults.length > 0 && recognizedResults.map((result, idx) => (
                  <div
                    key={`live-${idx}`}
                    className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors ${
                      result.face_matched ? "hover:bg-muted/50" : "bg-red-50/50"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        result.face_matched
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {result.face_matched ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {result.face_matched ? result.message : "Unknown Face"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Confidence: {(result.confidence * 100).toFixed(1)}%
                        {result.is_suspicious && " · ⚠️ Suspicious"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge
                        variant={
                          result.status === "PRESENT"
                            ? "success"
                            : "destructive"
                        }
                      >
                        {result.status}
                      </Badge>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {new Date(result.marked_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))}

              {/* Show server-side attendance records when session is ended */}
              {sessionState === "ended" && isLoadingAttendance && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {sessionState === "ended" &&
                !isLoadingAttendance &&
                classAttendance.map((record) => (
                  <div
                    key={record.id}
                    className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors ${
                      record.status === "ABSENT"
                        ? "bg-red-50/50"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <Avatar
                      fallback={
                        record.student_detail
                          ? record.student_detail
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)
                          : "?"
                      }
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {record.student_detail || record.student}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {record.verification_log
                          ? `Confidence: ${(
                              record.verification_log.face_confidence * 100
                            ).toFixed(1)}%`
                          : "No verification data"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge
                        variant={
                          record.status === "PRESENT"
                            ? "success"
                            : "destructive"
                        }
                      >
                        {record.status}
                      </Badge>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {new Date(record.marked_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))}

              {/* Empty state */}
              {recognizedResults.length === 0 &&
                (sessionState === "idle" || sessionState === "running") && (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    {sessionState === "idle"
                      ? "Start a session to see attendance data."
                      : "Capture faces to begin marking attendance."}
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
