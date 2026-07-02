"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, X } from "lucide-react";
import { toast } from "sonner";

interface StudentAttendanceMarkerProps {
  classSessionId: string;
  attendanceSessionId?: string; // NEW: WebSocket session ID (can be undefined if session not yet started)
  className: string;
  onSuccess?: () => void;
  autoOpen?: boolean;
}

const WS_BASE_URL = (process.env.NEXT_PUBLIC_WS_URL || 'wss://attendance-backend-d3vk.onrender.com')
  .replace(/^http/, 'ws')
  .replace(/^https/, 'wss');

export function StudentAttendanceMarker({
  classSessionId,
  attendanceSessionId,
  className,
  onSuccess,
  autoOpen = false,
}: StudentAttendanceMarkerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const frameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-open when autoOpen changes
  useEffect(() => {
    if (autoOpen && !isOpen) {
      setIsOpen(true);
    }
  }, [autoOpen, isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setShowCamera(true);
        setStatus("Camera ready. Connecting...");
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
    setShowCamera(false);
  };

  const connectWebSocket = async () => {
    if (!attendanceSessionId) {
      setStatus("❌ Session not started yet");
      toast.error("Teacher has not started the session yet");
      return;
    }
    
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const wsUrl = `${WS_BASE_URL}/ws/student-attendance/stream/${attendanceSessionId}/?token=${encodeURIComponent(token || "")}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      logger.info("WebSocket connected");
      setStatus("🟢 Connected. Streaming frames...");
      setIsStreaming(true);
      startFrameCapture();
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === "connection_established") {
        setStatus("✅ Connected to ML service");
      } else if (message.type === "frame_processed") {
        if (message.status === "attendance_marked") {
          setAttendanceMarked(true);
          setStatus("✅ Attendance Marked!");
          setConfidence(message.confidence);
          toast.success(`✅ Attendance marked! (${(message.confidence * 100).toFixed(0)}% confidence)`);
          
          // Stop streaming after marked
          setTimeout(() => {
            stopStreaming();
            setIsOpen(false);
            onSuccess?.();
          }, 2000);
        } else if (message.status === "face_detected_low_confidence") {
          setStatus(`⚠️ Face detected (${(message.confidence * 100).toFixed(0)}% - move closer)`);
          setConfidence(message.confidence);
        } else if (message.status === "no_face_detected") {
          setStatus("📷 No face detected - position in camera");
        } else if (message.status === "already_marked") {
          setStatus("✅ Already marked for this session");
          setAttendanceMarked(true);
        } else {
          setStatus(message.message || "Processing...");
        }
      } else if (message.type === "error") {
        setStatus(`❌ Error: ${message.detail}`);
        toast.error(message.detail);
      }
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("❌ Connection error");
      toast.error("WebSocket connection failed");
      stopStreaming();
    };
    
    ws.onclose = () => {
      setIsStreaming(false);
      setStatus("Disconnected");
    };
    
    wsRef.current = ws;
  };

  const startFrameCapture = () => {
    // Capture and send frames every 500ms (2 FPS)
    frameIntervalRef.current = setInterval(() => {
      if (!videoRef.current || !canvasRef.current || !wsRef.current) return;
      
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) return;
      
      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (!blob) return;
          
          const reader = new FileReader();
          reader.onload = () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: "frame",
                data: reader.result,
              }));
            }
          };
          reader.readAsDataURL(blob);
        }, "image/jpeg", 0.8);
      } catch (error) {
        console.error("Frame capture error:", error);
      }
    }, 500);
  };

  const stopStreaming = () => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsStreaming(false);
    stopCamera();
  };

  const handleClose = () => {
    stopStreaming();
    setIsOpen(false);
    setAttendanceMarked(false);
    setStatus("");
    setConfidence(null);
  };

  // Auto-start camera when dialog opens
  useEffect(() => {
    if (isOpen && !showCamera) {
      startCamera();
    }
    return () => {
      if (!isOpen) {
        stopStreaming();
      }
    };
  }, [isOpen, showCamera]);

  // Connect WebSocket when camera is ready
  useEffect(() => {
    if (showCamera && !isStreaming && !wsRef.current) {
      connectWebSocket();
    }
  }, [showCamera, isStreaming]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Camera className="h-4 w-4" />
          Mark Attendance
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            {className} — Face recognition in progress
          </DialogDescription>
        </DialogHeader>

        {showCamera ? (
          <div className="space-y-4">
            {/* Video Preview */}
            <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Face guide circle overlay */}
              <svg
                className="absolute inset-0 h-full w-full pointer-events-none"
                viewBox="0 0 640 480"
                preserveAspectRatio="xMidYMid slice"
              >
                <circle
                  cx="320"
                  cy="240"
                  r="100"
                  fill="none"
                  stroke={attendanceMarked ? "rgba(34, 197, 94, 0.6)" : "rgba(59, 130, 246, 0.3)"}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <line
                  x1="320"
                  y1="200"
                  x2="320"
                  y2="280"
                  stroke={attendanceMarked ? "rgba(34, 197, 94, 0.6)" : "rgba(59, 130, 246, 0.5)"}
                  strokeWidth="1"
                />
                <line
                  x1="280"
                  y1="240"
                  x2="360"
                  y2="240"
                  stroke={attendanceMarked ? "rgba(34, 197, 94, 0.6)" : "rgba(59, 130, 246, 0.5)"}
                  strokeWidth="1"
                />
              </svg>
              <div className="absolute inset-4 border-2 border-white/20 rounded-lg pointer-events-none" />
            </div>

            {/* Hidden canvas for frame capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Status Display */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-700">
              <p className="text-sm text-center font-medium text-white">
                {status || "Initializing..."}
              </p>
              {confidence !== null && (
                <p className="text-xs text-center text-slate-400 mt-1">
                  Confidence: {(confidence * 100).toFixed(0)}%
                </p>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isStreaming && !attendanceMarked}
                className="flex-1"
              >
                {attendanceMarked ? "Done" : "Cancel"}
              </Button>
              {attendanceMarked && (
                <Button disabled className="flex-1 bg-emerald-600 gap-2">
                  ✅ Marked
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <Camera className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
            <p className="text-sm text-muted-foreground">
              {isStreaming ? "Connecting..." : "Initializing camera..."}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Simple logger
const logger = {
  info: (msg: string) => console.log(msg),
  error: (msg: string) => console.error(msg),
};
