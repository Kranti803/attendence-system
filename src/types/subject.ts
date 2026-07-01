export interface CreateSubjectPayload {
  name: string;
  code: string;
  department: string;
  semester: number;
  teacher?: string | null;
}

export interface UpdateSubjectPayload {
  name?: string;
  code?: string;
  department?: string;
  semester?: number;
  teacher?: string | null;
}

export interface Subject {
  id: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  code: string;
  department: string;
  semester?: number | null;
  teacher?: string | null;
  teacher_name?: string;
  teacher_email?: string;
}
