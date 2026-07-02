"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface StudentAttendanceMarkerProps {
  classSessionId: string;
  attendanceSessionId?: string;
  className: string;
  onSuccess?: () => void;
  autoOpen?: boolean;
}

const WS_BASE_URL = (process.env.NEXT_PUBLIC_WS_URL || 'wss://attendance-backend-d3vk.onrender.com')
  .replace(/^http/, 'ws')
  .replace(/^https/, 'wss');

export function StudentAttendanceMarker({
  classSessionId: _classSessionId,
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
  const [faces, setFaces] = useState<any[]>([]);
  const [videoDimensions, setVideoDimensions] = useState({ width: 1280, height: 720 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const frameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (autoOpen && !isOpen) {
      setIsOpen(true);
    }
  }, [autoOpen, isOpen]);

  const startCamera = async () => {
    try {
      let attempts = 0;
      while (!videoRef.current && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 50));
        attempts++;
      }
      
      if (!videoRef.current) {
        setStatus('Camera element failed to mount');
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            setVideoDimensions({
              width: videoRef.current.videoWidth || 1280,
              height: videoRef.current.videoHeight || 720,
            });
          }
        };
        streamRef.current = stream;
        setShowCamera(true);
        setStatus("Camera ready. Connecting...");
      }
    } catch (error) {
      toast.error(`Could not access camera: ${(error as any).message}`);
      setStatus(`Camera error: ${(error as any).message}`);
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
      setStatus("Session not started yet");
      toast.error("Teacher has not started the session yet");
      return;
    }
    
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    
    if (!token) {
      setStatus("Authentication token missing");
      toast.error("Authentication token not found. Please login again.");
      return;
    }
    
    const wsUrl = `${WS_BASE_URL}/ws/student-attendance/stream/${attendanceSessionId}/?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setStatus("Connected. Streaming frames...");
      setIsStreaming(true);
      startFrameCapture();
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === "connection_established") {
        setStatus("Connected to ML service");
      } else if (message.type === "frame_processed") {
        if (message.faces && Array.isArray(message.faces)) {
          setFaces(message.faces);
        } else {
          setFaces([]);
        }

        if (message.status === "attendance_marked") {
          setAttendanceMarked(true);
          setStatus("Attendance Marked!");
          setConfidence(message.confidence);
          toast.success(`Attendance marked! (${(message.confidence * 100).toFixed(0)}% confidence)`);
          
          setTimeout(() => {
            stopStreaming();
            setIsOpen(false);
            onSuccess?.();
          }, 2000);
        } else if (message.status === "face_detected_low_confidence") {
          setStatus(`Face detected (${(message.confidence * 100).toFixed(0)}% - move closer)`);
          setConfidence(message.confidence);
        } else if (message.status === "no_face_detected") {
          setStatus("No face detected - position in camera");
        } else if (message.status === "already_marked") {
          setStatus("Already marked for this session");
          setAttendanceMarked(true);
        } else {
          setStatus(message.message || `Processing... (${message.total_faces_detected || 0} faces)`);
        }
      } else if (message.type === "error") {
        setStatus(`Error: ${message.detail}`);
        toast.error(message.detail);
      }
    };
    
    ws.onerror = () => {
      setStatus("Connection failed");
      toast.error("Failed to connect to camera service");
      stopStreaming();
      setIsOpen(false);
    };
    
    ws.onclose = () => {
      setIsStreaming(false);
      setStatus("Disconnected");
    };
    
    wsRef.current = ws;
  };

  const startFrameCapture = () => {
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
    setFaces([]);
  };

  useEffect(() => {
    if (isOpen && !showCamera) {
      const timeout = setTimeout(() => {
        startCamera();
      }, 100);
      
      return () => clearTimeout(timeout);
    }
    return () => {
      if (!isOpen) {
        stopStreaming();
      }
    };
  }, [isOpen, showCamera]);

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

      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            {className} — Face recognition in progress
          </DialogDescription>
        </DialogHeader>

        {isOpen && (
          <div className="space-y-4">
            <div className={`relative w-full bg-black rounded-lg overflow-hidden ${showCamera ? 'aspect-video' : 'aspect-square'}`}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${showCamera ? 'block' : 'hidden'}`}
              />
              
              {showCamera && faces && faces.length > 0 && (
                <svg
                  viewBox={`0 0 ${videoDimensions.width} ${videoDimensions.height}`}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  preserveAspectRatio="none"
                >
                  {faces.map((face, index) => {
                    let color = "#ef4444";
                    if (face.status === "identified" || face.student_id === "present") {
                      color = "#10b981";
                    } else if (face.status === "ambiguous") {
                      color = "#eab308";
                    }
                    
                    return (
                      <g key={index}>
                        <rect
                          x={face.x}
                          y={face.y}
                          width={face.w}
                          height={face.h}
                          fill="none"
                          stroke={color}
                          strokeWidth="3"
                          rx="4"
                        />
                        {face.student_name && (
                          <>
                            <rect
                              x={face.x}
                              y={Math.max(0, face.y - 35)}
                              width={face.student_name.length * 8 + 10}
                              height="25"
                              fill={color}
                              opacity="0.8"
                              rx="3"
                            />
                            <text
                              x={face.x + 5}
                              y={Math.max(20, face.y - 12)}
                              fill="white"
                              fontSize="14"
                              fontWeight="bold"
                              fontFamily="Arial, sans-serif"
                            >
                              {face.student_name}
                            </text>
                          </>
                        )}
                        {face.confidence && (
                          <text
                            x={face.x + 5}
                            y={face.y + face.h - 8}
                            fill={color}
                            fontSize="12"
                            fontWeight="bold"
                            fontFamily="Arial, sans-serif"
                          >
                            {(face.confidence * 100).toFixed(0)}%
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              )}
              
              {!showCamera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black bg-opacity-50">
                  <Camera className="h-8 w-8 text-slate-400 animate-pulse" />
                  <p className="text-sm text-slate-400">Starting camera...</p>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
              <p className="text-sm text-center font-medium text-slate-900">
                {status || "Initializing..."}
              </p>
              {confidence !== null && (
                <p className="text-xs text-center text-slate-600 mt-1">
                  Confidence: {(confidence * 100).toFixed(0)}%
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isStreaming && !attendanceMarked}
                className="flex-1"
              >
                {attendanceMarked ? "Done" : "Cancel"}
              </Button>
              {attendanceMarked && (
                <Button disabled className="flex-1 bg-green-600 text-white">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Marked
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
