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
  const sendQueueRef = useRef<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
          case 'detection':
            if (message.detected && message.detected.length > 0) {
              setDetectedStudents((prev) => {
                const newIds = new Set(message.detected.map((d) => d.student_id));
                const filtered = prev.filter((p) => !newIds.has(p.student_id));
                return [...filtered, ...message.detected];
              });
              onDetected?.(message.detected);
            }
            break;
          case 'connected':
            break;
          case 'error':
            setError(message.message);
            onError?.(message.message);
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

  // Start continuous frame streaming when connected
  useEffect(() => {
    if (!isConnected) return;

    const streamFrames = () => {
      // This will be called by the camera component
      // The actual frame capture/send logic stays in the component
    };

    return () => {
      // Cleanup handled by component
    };
  }, [isConnected]);

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