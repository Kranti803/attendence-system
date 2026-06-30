import { useEffect, useRef, useCallback, useState } from 'react';
import { getWebSocketUrl } from '@/services/attendance.service';
import { DetectedStudent, WSMessage, FaceOverlay } from '@/types/attendance';

interface UseAttendanceStreamOptions {
  sessionId: string | null;
  onDetected?: (students: DetectedStudent[]) => void;
  onConnected?: () => void;
  onError?: (error: string) => void;
  frameInterval?: number; // ms between frames (default 300ms)
}

interface UseAttendanceStreamReturn {
  isConnected: boolean;
  isConnecting: boolean;
  sendFrame: (frameData: string) => void;
  detectedStudents: DetectedStudent[];
  faces: FaceOverlay[];
  error: string | null;
}

export const useAttendanceStream = ({
  sessionId,
  onDetected,
  onConnected,
  onError,
  frameInterval = 300,
}: UseAttendanceStreamOptions): UseAttendanceStreamReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const onDetectedRef = useRef(onDetected);
  const onConnectedRef = useRef(onConnected);
  const onErrorRef = useRef(onError);
  const lastErrorRef = useRef<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [detectedStudents, setDetectedStudents] = useState<DetectedStudent[]>([]);
  const [faces, setFaces] = useState<FaceOverlay[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onDetectedRef.current = onDetected;
    onConnectedRef.current = onConnected;
    onErrorRef.current = onError;
  }, [onDetected, onConnected, onError]);

  // Connect to WebSocket
  useEffect(() => {
    if (!sessionId) {
      setIsConnected(false);
      setIsConnecting(false);
      return;
    }

    setIsConnecting(true);
    setError(null);
    lastErrorRef.current = null;
    setDetectedStudents([]);

    const wsUrl = getWebSocketUrl(sessionId);
    const ws = new WebSocket(wsUrl);
    let isActive = true;

    wsRef.current = ws;

    // ── Stale-faces watchdog ────────────────────────────────────────────────
    // If the backend goes silent (busy processing, Render cold-start, etc.) for
    // more than FACE_STALE_MS milliseconds, clear the face boxes so the user
    // doesn't see a permanently-green box after stepping out of frame.
    const FACE_STALE_MS = 2000;
    let staleTimer: ReturnType<typeof setTimeout> | null = null;

    const resetStaleTimer = () => {
      if (staleTimer) clearTimeout(staleTimer);
      staleTimer = setTimeout(() => {
        if (isActive) setFaces([]);
      }, FACE_STALE_MS);
    };

    ws.onopen = () => {
      if (!isActive) return;
      setIsConnected(true);
      setIsConnecting(false);
      onConnectedRef.current?.();
    };

    ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);

        switch (message.type) {
          case 'frame_processed': {
            // Every time ANY frame result arrives, reset the stale timer.
            // This means boxes only clear if the backend goes SILENT for 2s.
            resetStaleTimer();

            // Update face bounding boxes on every frame (replaces, not accumulates)
            setFaces(message.faces ?? []);

            const raw = message.newly_detected || [];
            if (raw.length > 0) {
              const mapped: DetectedStudent[] = raw.map((d) => ({
                student_id: d.student_id,
                student_name: d.student_name || d.student_email || 'Unknown',
                student_roll_number: d.student_roll_number || '',
                marked_at: d.marked_at || message.timestamp,
                confidence: d.confidence ?? 0,
              }));

              setDetectedStudents((prev) => {
                const newIds = new Set(mapped.map((s) => s.student_id));
                const filtered = prev.filter((p) => !newIds.has(p.student_id));
                return [...filtered, ...mapped];
              });
              onDetectedRef.current?.(mapped);
            }
            break;
          }
          case 'connection_established':
            break;
          case 'error':
            if (!isActive) return;
            {
              const nextError = message.detail || 'WebSocket error';
              setError(nextError);
              if (lastErrorRef.current !== nextError) {
                lastErrorRef.current = nextError;
                onErrorRef.current?.(nextError);
              }
            }
            break;
        }
      } catch (e) {
        console.error('Failed to parse WS message:', e);
      }
    };

    ws.onerror = (e) => {
      if (!isActive) return;
      console.error('WebSocket error:', e);
      const nextError = 'WebSocket connection error';
      setError(nextError);
      if (lastErrorRef.current !== nextError) {
        lastErrorRef.current = nextError;
        onErrorRef.current?.(nextError);
      }
    };

    ws.onclose = (event) => {
      if (!isActive) return;
      setIsConnected(false);
      setIsConnecting(false);
      setFaces([]); // clear boxes on disconnect

      let closeMessage: string | null = null;
      if (event.code === 4003) {
        closeMessage = 'WebSocket auth failed. Please log in again.';
      } else if (event.code === 4004) {
        closeMessage = 'Attendance session not found or already ended.';
      } else if (!event.wasClean && event.code !== 1000) {
        closeMessage = `WebSocket closed (${event.code}).`;
      }

      if (closeMessage) {
        setError(closeMessage);
        if (lastErrorRef.current !== closeMessage) {
          lastErrorRef.current = closeMessage;
          onErrorRef.current?.(closeMessage);
        }
      }
    };

    return () => {
      isActive = false;
      if (staleTimer) clearTimeout(staleTimer);
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
    };
  }, [sessionId]);

  // Send frame function
  const sendFrame = useCallback((frameData: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'frame', data: frameData }));
    }
  }, []);

  return {
    isConnected,
    isConnecting,
    sendFrame,
    detectedStudents,
    faces,
    error,
  };
};

// Helper hook for continuous frame capture and streaming
export const useAttendanceCameraStream = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isStreaming: boolean,
  sendFrame: (data: string) => void,
  interval: number = 150
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isStreaming || !videoRef.current) return;

    // Create offscreen canvas — smaller = faster transmission to Render
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 360;
    canvasRef.current = canvas;

    intervalRef.current = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      // 0.6 quality keeps file size small; HOG operates on grayscale so quality
      // beyond 0.65 yields diminishing returns on recognition accuracy.
      const frameData = canvasRef.current.toDataURL('image/jpeg', 0.6);
      sendFrame(frameData);
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStreaming, videoRef, sendFrame, interval]);

  return null;
};