"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, ChevronDown, ImagePlus, Camera, Play, Square, X } from "lucide-react";
import { toast } from "sonner";

const departments = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Engineering",
  "Biology",
];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
const subjects = ["CS101", "CS201", "CS401", "MATH201", "PHY301", "ENG102"];

export function CreateStudentDialog() {
  const [open, setOpen] = React.useState(false);

  // Camera state
  const [cameraMode, setCameraMode] = React.useState<"upload" | "camera">("upload");
  const [isCameraActive, setIsCameraActive] = React.useState(false);
  const [capturedFrames, setCapturedFrames] = React.useState<string[]>([]);
  
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
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

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0);
    const frameData = canvasRef.current.toDataURL("image/jpeg", 0.85);
    
    setCapturedFrames((prev) => [...prev, frameData]);
    toast.success(`Frame ${capturedFrames.length + 1} captured`);
  };

  const removeFrame = (index: number) => {
    setCapturedFrames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSwitchMode = (mode: "upload" | "camera") => {
    stopCamera();
    setCameraMode(mode);
    setCapturedFrames([]);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      stopCamera();
      setCameraMode("upload");
      setCapturedFrames([]);
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[calc(100svh-2rem)] overflow-y-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            
            // Validate that user provided face images
            const uploadedFiles = (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement)?.files;
            const hasUploadedImages = uploadedFiles && uploadedFiles.length > 0;
            const hasCapturedFrames = cameraMode === "camera" && capturedFrames.length >= 3;
            
            if (!hasUploadedImages && !hasCapturedFrames) {
              toast.error(`Please ${cameraMode === "upload" ? "upload at least 3 images" : "capture at least 3 frames"}`);
              return;
            }

            if (cameraMode === "camera" && capturedFrames.length < 3) {
              toast.error(`Capture at least ${3 - capturedFrames.length} more frame(s)`);
              return;
            }

            toast.success("Student created successfully!");
            setOpen(false);
            stopCamera();
            setCameraMode("upload");
            setCapturedFrames([]);
          }}
        >
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>
              Register a student and collect face images for recognition.
              Upload at least{" "}
              <span className="font-medium text-foreground">3–5</span>{" "}
              images.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 grid gap-6">
            {/* Basic Info */}
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground">
                Basic Info
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input placeholder="e.g. Alice Johnson" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Roll Number <span className="text-destructive">*</span>
                  </label>
                  <Input placeholder="e.g. STU-2026-001" required />
                  <p className="text-xs text-muted-foreground">
                    Must be unique.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <Input type="email" placeholder="alice@university.edu" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Phone Number{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <Input placeholder="+1 (234) 567-8900" />
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground">
                Academic Info
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Department <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      defaultValue=""
                      className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="" disabled>
                        Select department…
                      </option>
                      {departments.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Year / Semester{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <div className="relative">
                    <select
                      defaultValue=""
                      className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="" disabled>
                        Select…
                      </option>
                      {semesters.map((s) => (
                        <option key={s} value={s}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Enrolled Subjects{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="grid gap-2 rounded-xl border border-border bg-background p-3 sm:grid-cols-2">
                    {subjects.map((s) => (
                      <label
                        key={s}
                        className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-accent"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border border-input accent-primary"
                          required={s === subjects[0]}
                        />
                        <span className="font-mono text-xs text-muted-foreground">
                          {s}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select at least one subject.
                  </p>
                </div>
              </div>
            </div>

            {/* Face Recognition Data */}
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground">
                Face Recognition Data{" "}
                <span className="text-destructive">(required)</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Provide at least 3–5 clear images with different angles
                and lighting.
              </p>

              {/* Toggle Buttons */}
              <div className="mt-4 flex gap-2 border-b border-border">
                <button
                  type="button"
                  onClick={() => handleSwitchMode("upload")}
                  className={`pb-2 px-1 text-sm font-medium transition-colors ${
                    cameraMode === "upload"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ImagePlus className="inline h-4 w-4 mr-1" />
                  Upload Images
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("camera")}
                  className={`pb-2 px-1 text-sm font-medium transition-colors ${
                    cameraMode === "camera"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Camera className="inline h-4 w-4 mr-1" />
                  Capture from Camera
                </button>
              </div>

              {/* Upload Mode */}
              {cameraMode === "upload" && (
                <div className="mt-4 rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Upload Images
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Multiple images supported (JPG/PNG).
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ImagePlus className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      required={cameraMode === "upload"}
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum: 3 images. Recommended: 5+ images.
                    </p>
                  </div>
                </div>
              )}

              {/* Camera Capture Mode */}
              {cameraMode === "camera" && (
                <div className="mt-4 rounded-2xl border border-border bg-background p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Capture from Camera
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {capturedFrames.length > 0
                          ? `${capturedFrames.length} frame(s) captured`
                          : "Start camera and capture frames"}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Camera className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Video Preview */}
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-950 relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {!isCameraActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 text-white/60">
                        <div className="text-center">
                          <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Camera is offline</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hidden Canvas for capturing */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Camera Controls */}
                  <div className="flex gap-2">
                    {!isCameraActive ? (
                      <Button
                        type="button"
                        onClick={startCamera}
                        className="flex-1"
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2 fill-current" />
                        Start Camera
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="button"
                          onClick={captureFrame}
                          className="flex-1"
                          size="sm"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Capture Frame
                        </Button>
                        <Button
                          type="button"
                          onClick={stopCamera}
                          variant="outline"
                          size="sm"
                        >
                          <Square className="h-4 w-4 fill-current" />
                        </Button>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Capture at least 3–5 frames with different angles and lighting.
                  </p>

                  {/* Captured Frames Grid */}
                  {capturedFrames.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">
                        Captured Frames
                      </p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                        {capturedFrames.map((frame, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={frame}
                              alt={`Captured frame ${idx + 1}`}
                              className="w-full h-20 object-cover rounded-lg border border-border"
                            />
                            <button
                              type="button"
                              onClick={() => removeFrame(idx)}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Click X to remove a frame.
                      </p>
                    </div>
                  )}

                  {capturedFrames.length < 3 && capturedFrames.length > 0 && (
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/50">
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        ⚠️ Capture at least {3 - capturedFrames.length} more frame(s) for better recognition.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create Student</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
