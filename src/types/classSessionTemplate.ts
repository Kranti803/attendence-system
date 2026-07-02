export interface ClassSessionTemplate {
  id: string;
  subject: string;           // UUID
  subject_name: string;
  subject_code: string;
  teacher_name: string;
  day_of_week: number;       // 0=Monday, 6=Sunday
  day_of_week_display: string; // "Monday", "Tuesday", etc.
  start_time: string;        // HH:MM:SS
  end_time: string;          // HH:MM:SS
  max_attendance_marking_minutes: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClassSessionTemplatePayload {
  subject: string;           // UUID
  day_of_week: number;       // 0=Monday, 6=Sunday
  start_time: string;        // HH:MM format
  end_time: string;          // HH:MM format
  max_attendance_marking_minutes?: number;
  is_active?: boolean;
}

export interface UpdateClassSessionTemplatePayload {
  day_of_week?: number;
  start_time?: string;
  end_time?: string;
  max_attendance_marking_minutes?: number;
  is_active?: boolean;
}
