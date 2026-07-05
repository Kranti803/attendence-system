import { useRef, useEffect, useCallback } from 'react';
import { FaceOverlay } from '@/types/attendance';

/**
 * High-performance canvas drawing that bypasses React state batching.
 * Faces are drawn IMMEDIATELY when WebSocket receives them, not on next render.
 * 
 * This fixes the "boxes appear late" issue by:
 * 1. Storing faces in a ref (not state)
 * 2. Drawing directly in the WebSocket callback (not via setState)
 * 3. Using RAF for smooth rendering at display refresh rate
 */

interface UseInstantCanvasDrawProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isActive: boolean;
}

export const useInstantCanvasDraw = ({
  videoRef,
  canvasRef,
  isActive,
}: UseInstantCanvasDrawProps) => {
  const facesRef = useRef<FaceOverlay[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastDrawTimeRef = useRef<number>(0);
  const DRAW_THROTTLE_MS = 16.67; // ~60fps

  // Direct draw function - called immediately from WebSocket
  const drawFaces = useCallback((faces: FaceOverlay[]) => {
    facesRef.current = faces;
    
    // Optionally throttle to avoid excessive redraws
    const now = performance.now();
    if (now - lastDrawTimeRef.current < DRAW_THROTTLE_MS) {
      return;
    }
    lastDrawTimeRef.current = now;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    // Scaling from video capture size (480x360) to canvas display size
    const scaleX = canvas.width / 480;
    const scaleY = canvas.height / 360;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each face
    faces.forEach((face: FaceOverlay) => {
      const x = face.x * scaleX;
      const y = face.y * scaleY;
      const w = face.w * scaleX;
      const h = face.h * scaleY;

      // Color based on status
      const color =
        face.status === 'identified'
          ? '#22c55e' // Green
          : face.status === 'ambiguous'
            ? '#eab308' // Yellow
            : '#ef4444'; // Red

      // Glowing box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.strokeRect(x, y, w, h);
      ctx.shadowBlur = 0;

      // Translucent fill
      ctx.fillStyle = color + '10';
      ctx.fillRect(x, y, w, h);

      // Label text
      let label = 'UNKNOWN';
      if (face.status === 'identified') {
        label = face.student_name || 'IDENTIFIED';
      } else if (face.status === 'ambiguous') {
        label = 'AMBIGUOUS';
      }

      const fontSize = Math.max(8, Math.round(w * 0.08));
      ctx.font = `500 ${fontSize}px Inter, sans-serif`;
      const textW = ctx.measureText(label).width;
      const labelH = fontSize + 4;
      const labelY = y > labelH + 4 ? y - labelH - 2 : y + h + 2;

      ctx.fillStyle = color;
      ctx.fillRect(x, labelY, textW + 8, labelH);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, x + 4, labelY + fontSize - 2);
    });
  }, [canvasRef, videoRef, isActive]);

  // RAF loop for smooth rendering
  useEffect(() => {
    if (!isActive || !canvasRef.current || !videoRef.current) return;

    const animate = () => {
      // Redraw on each frame (facesRef is already updated by drawFaces)
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (!canvas || !video) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const scaleX = canvas.width / 480;
      const scaleY = canvas.height / 360;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw all faces currently in ref
      facesRef.current.forEach((face: FaceOverlay) => {
        const x = face.x * scaleX;
        const y = face.y * scaleY;
        const w = face.w * scaleX;
        const h = face.h * scaleY;

        const color =
          face.status === 'identified'
            ? '#22c55e'
            : face.status === 'ambiguous'
              ? '#eab308'
              : '#ef4444';

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.strokeRect(x, y, w, h);
        ctx.shadowBlur = 0;

        ctx.fillStyle = color + '10';
        ctx.fillRect(x, y, w, h);

        let label = 'UNKNOWN';
        if (face.status === 'identified') {
          label = face.student_name || 'IDENTIFIED';
        } else if (face.status === 'ambiguous') {
          label = 'AMBIGUOUS';
        }

        const fontSize = Math.max(8, Math.round(w * 0.08));
        ctx.font = `500 ${fontSize}px Inter, sans-serif`;
        const textW = ctx.measureText(label).width;
        const labelH = fontSize + 4;
        const labelY = y > labelH + 4 ? y - labelH - 2 : y + h + 2;

        ctx.fillStyle = color;
        ctx.fillRect(x, labelY, textW + 8, labelH);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, x + 4, labelY + fontSize - 2);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isActive]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clear faces when inactive
  useEffect(() => {
    if (!isActive) {
      facesRef.current = [];
    }
  }, [isActive]);

  return {
    drawFaces, // Call this directly from WebSocket callbacks
    getFaces: () => facesRef.current, // Get current faces if needed
    clearFaces: () => {
      facesRef.current = [];
    },
  };
};
