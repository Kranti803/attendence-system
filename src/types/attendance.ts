// ── Mark Attendance (Face Recognition) ──────────────────────────────────────

export interface AttendanceMarkPayload {
  image: File;
  class_session_id: string;
  latitude?: number | null;
  longitude?: number | null;
  distance_from_classroom?: number | null;
  liveness_passed?: 'PASS' | 'FAIL' | 'UNKNOWN' | null;
  timestamp_signed?: string | null;
}

export interface AttendanceMarkResponse {
  attendance_id: string;
  status: 'PRESENT' | 'ABSENT';
  marked_at: string;
  face_matched: boolean;
  confidence: number;
  distance_to_nearest: number;
  is_suspicious: boolean;
  message: string;
}

// ── Attendance Record (Read) ────────────────────────────────────────────────

export interface AttendanceVerificationLog {
  id: string;
  attendance: string;
  face_confidence: number;
  distance_to_nearest: number;
  latitude?: number | null;
  longitude?: number | null;
  distance_from_classroom?: number | null;
  liveness_passed?: 'PASS' | 'FAIL' | 'UNKNOWN';
  face_image_path?: string | null;
  is_suspicious: boolean;
  timestamp_signed?: string | null;
  created_at: string;
}

export interface AttendanceRead {
  id: string;
  student: string;
  student_detail?: {
    email: string;
    name: string;
    roll_number: string;
  };
  class_session: string;
  class_session_detail?: {
    id: string;
    class_name: string;
    subject: string;
    date: string;
    start_time: string;
  };
  status: 'PRESENT' | 'ABSENT';
  marked_at: string;
  verification_log?: AttendanceVerificationLog;
}

export interface Attendance {
  id: string;
  student: string;
  student_email: string;
  student_name: string;
  class_session: string;
  status: 'PRESENT' | 'ABSENT';
  marked_at: string;
  verification_log?: AttendanceVerificationLog;
}

// ── Session Summary ─────────────────────────────────────────────────────────

export interface SessionSummary {
  session_id: string;
  class_name: string;
  date: string;
  total_students: number;
  present: number;
  absent: number;
  attendance_rate: number;
}

// ── Face Enrollment Status ──────────────────────────────────────────────────

export interface FaceEnrollmentStatus {
  total_photos_registered: number;
  registration_confidence: number;
  is_enrolled: boolean;
  message: string;
}

export interface FaceData {
  id: string;
  student: string;
  student_email: string;
  student_roll_number: string;
  is_enrolled: boolean;
  embeddings: {
    id: string;
    photo_number: number;
    quality_score: number;
    created_at: string;
  }[];
  created_at: string;
  updated_at: string;
}

// ── Live Attendance Session (WebSocket) ─────────────────────────────────────

export interface AttendanceSessionStartPayload {
  class_session: string;
}

export interface AttendanceSessionStartResponse {
  id: string;
  class_session: string;
  class_session_detail?: {
    id: string;
    class_name: string;
    date: string;
  };
  initiated_by: string;
  initiated_by_email?: string;
  started_at: string;
  ended_at: string | null;
  marked_students: string[];
  marked_students_count: number;
}

export interface AttendanceSessionEndResponse {
  session_id: string;
  status: 'ended';
  summary: {
    total_students: number;
    present: number;
    absent: number;
    attendance_rate: number;
  };
  detected_students: DetectedStudent[];
  absent_students: string[];
}

export interface DetectedStudent {
  student_id: string;
  student_name: string;
  student_roll_number: string;
  marked_at: string;
  confidence: number;
}

// ── Face Overlay (bounding boxes from WebSocket) ────────────────────────────

export interface FaceOverlay {
  x: number;
  y: number;
  w: number;
  h: number;
  status: 'identified' | 'unknown' | 'ambiguous';
  student_id: string | null;
  student_name?: string;
  confidence: number;
}

// WebSocket message types
export interface WSFrameMessage {
  type: 'frame';
  data: string; // base64 encoded image
}

export interface WSFrameProcessedMessage {
  type: 'frame_processed';
  newly_detected: {
    student_id: string;
    student_email?: string;
    student_name?: string;
    student_roll_number?: string;
    confidence: number;
    distance: number;
    marked_at: string;
  }[];
  /** Per-face bounding boxes with detection status */
  faces: FaceOverlay[];
  ml_status?: string;
  total_faces_detected?: number;
  nearest_distance?: number | null;
  timestamp: string;
}

export interface WSConnectedMessage {
  type: 'connection_established';
  session_id: string;
  status: string;
  message: string;
}

export interface WSErrorMessage {
  type: 'error';
  detail: string;
}

export type WSMessage = WSFrameProcessedMessage | WSConnectedMessage | WSErrorMessage;
