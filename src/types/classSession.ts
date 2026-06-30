export interface ClassSession {
  id: string;
  class_name: string;
  date: string;        // YYYY-MM-DD
  start_time: string;  // HH:MM:SS
  end_time: string;    // HH:MM:SS
  subject: string;     // UUID
  subject_name?: string;
  subject_code?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClassSessionPayload {
  class_name: string;
  date: string;
  start_time: string;
  end_time: string;
  subject: string; // UUID
}

export interface UpdateClassSessionPayload {
  class_name?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  subject?: string;
}
