import { useEffect, useRef, useCallback, useState } from 'react';
import { getWebSocketUrl } from '@/services/attendance.service';
import { DetectedStudent, WSMessage } from '@/types/attendance';

interface UseAttendanceStreamOptions {
  sessionId: string | null;
  onDetected?: (students: DetectedStudent[]) => void;
  onConnected?: () => void;
  onError?: (error: string) => void;
  frameInterval?: number; // ms between frames (default 150ms)
}

interface UseAttendanceStreamReturn {
  isConnected: boolean;
  isConnecting: boolean;
  sendFrame: (frameData: string) => void;
  detectedStudents: DetectedStudent[];
  error: string | null;
}

export const useAttendanceStream = ({
  sessionId,
  onDetected,
  onConnected,
  onError,
  frameInterval = 150,
}: UseAttendanceStreamOptions): UseAttendanceStreamReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [detectedStudents, setDetectedStudents] = useState<DetectedStudent[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Connect to WebSocket
  useEffect(() => {
    if (!sessionId) return;

    setIsConnecting(true);
    setError(null);
    setDetectedStudents([]);

    const wsUrl = getWebSocketUrl(sessionId);
    const ws = new WebSocket(wsUrl);

    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);
      onConnected?.();
    };

    ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);

        switch (message.type) {
          case 'frame_processed': {
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
              onDetected?.(mapped);
            }
            break;
          }
          case 'connection_established':
            // Already handled by onopen, but we can still call onConnected
            onConnected?.();
            break;
          case 'error':
            setError(message.detail || 'WebSocket error');
            onError?.(message.detail || 'WebSocket error');
            break;
        }
      } catch (e) {
        console.error('Failed to parse WS message:', e);
      }
    };

    ws.onerror = (e) => {
      console.error('WebSocket error:', e);
      setError('WebSocket connection error');
      onError?.('WebSocket connection error');
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [sessionId, onConnected, onDetected, onError]);

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

    // Create offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = 640; // Reduced size for faster transmission
    canvas.height = 480;
    canvasRef.current = canvas;

    intervalRef.current = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const frameData = canvasRef.current.toDataURL('image/jpeg', 0.7);
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