export interface CreateEnrollmentPayload {
  student: string;
  subject: string;
}

export interface UpdateEnrollmentPayload {
  student?: string;
  subject?: string;
}

export interface Enrollment {
  id: string;
  created_at: string;
  updated_at: string;
  student: string;
  subject: string;
  // If the backend serializes relationships:
  student_detail?: any;
  subject_detail?: any;
}
