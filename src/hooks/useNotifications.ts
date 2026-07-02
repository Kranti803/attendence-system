import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export interface NotificationEvent {
  type: 'session_started' | 'session_ended' | 'attendance_marked' | 'connection_established';
  message: string;
  timestamp?: string;
  session_id?: string;
  class_session_id?: string;
  subject_code?: string;
  subject_name?: string;
  status?: 'PRESENT' | 'ABSENT';
  confidence?: number;
  marked_count?: number;
  absent_count?: number;
}

export type NotificationHandler = (event: NotificationEvent) => void;

interface UseNotificationsOptions {
  onSessionStarted?: NotificationHandler;
  onSessionEnded?: NotificationHandler;
  onAttendanceMarked?: NotificationHandler;
  onError?: (error: Error) => void;
  autoRefetch?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

/**
 * Hook for real-time WebSocket notifications.
 * Connects to the student notification channel and handles events.
 *
 * Usage:
 * ```
 * const { isConnected, lastEvent } = useNotifications({
 *   onSessionStarted: (event) => console.log('Session started:', event),
 *   autoRefetch: true,
 * });
 * ```
 */
export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const {
    onSessionStarted,
    onSessionEnded,
    onAttendanceMarked,
    onError,
    autoRefetch = true,
    reconnectAttempts = 5,
    reconnectDelay = 3000,
  } = options;

  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastEventRef = useRef<NotificationEvent | null>(null);

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('Already connected to notifications');
      return;
    }

    try {
      // Get JWT token from localStorage (same way as camera streaming)
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      
      if (!token) {
        console.warn('No authentication token found. WebSocket requires JWT authentication.');
        return;
      }

      // Use same WS_BASE_URL pattern as camera streaming
      const WS_BASE_URL = (process.env.NEXT_PUBLIC_WS_URL || 'wss://attendance-backend-d3vk.onrender.com')
        .replace(/^http/, 'ws')
        .replace(/^https/, 'wss');
      
      const wsUrl = `${WS_BASE_URL}/ws/notifications/?token=${encodeURIComponent(token)}`;

      console.log('Connecting to notifications:', wsUrl.split('?')[0]); // Log without token for security
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('✅ Connected to real-time notifications');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0; // Reset reconnect counter
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as NotificationEvent;
          lastEventRef.current = data;

          console.log('📬 Notification received:', data.type, data);

          switch (data.type) {
            case 'connection_established':
              console.log('Notification connection established');
              break;

            case 'session_started':
              console.log('🔴 Session started:', data.subject_code);
              
              // Refetch today's classes immediately
              if (autoRefetch) {
                queryClient.invalidateQueries({ queryKey: ['todaysClasses'] });
              }
              
              // Call custom handler
              if (onSessionStarted) {
                onSessionStarted(data);
              }
              break;

            case 'session_ended':
              console.log('✅ Session ended:', data.subject_code);
              
              // Refetch to update status
              if (autoRefetch) {
                queryClient.invalidateQueries({ queryKey: ['todaysClasses'] });
              }
              
              // Call custom handler
              if (onSessionEnded) {
                onSessionEnded(data);
              }
              break;

            case 'attendance_marked':
              console.log('✓ Attendance marked:', data.subject_code, data.status);
              
              // Refetch to show confidence score
              if (autoRefetch) {
                queryClient.invalidateQueries({ queryKey: ['todaysClasses'] });
              }
              
              // Call custom handler
              if (onAttendanceMarked) {
                onAttendanceMarked(data);
              }
              break;

            default:
              console.warn('Unknown notification type:', data.type);
          }
        } catch (err) {
          console.error('Error parsing notification:', err);
          if (onError) {
            onError(new Error('Failed to parse notification'));
          }
        }
      };

      wsRef.current.onerror = () => {
        console.error('❌ WebSocket error');
        setIsConnected(false);
        if (onError) {
          onError(new Error('WebSocket connection error'));
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket closed. Code:', event.code, 'Reason:', event.reason);
        setIsConnected(false);

        // Attempt to reconnect if not a normal close and haven't exceeded attempts
        if (event.code !== 1000 && reconnectAttemptsRef.current < reconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const delay = reconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1);
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${reconnectAttempts}) in ${delay}ms`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      if (onError) {
        onError(err instanceof Error ? err : new Error('Unknown error'));
      }
    }
  };

  useEffect(() => {
    // Only connect on initial mount
    if (!wsRef.current) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, 'Component unmounted');
      }
    };
  }, []); // Empty dependency array - only run once on mount

  return {
    isConnected,
    lastEvent: lastEventRef.current,
    reconnectAttempts: reconnectAttemptsRef.current,
  };
};
