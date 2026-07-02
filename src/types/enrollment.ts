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
  created_at?: string;
  updated_at?: string;
  student: string;
  subject: string;
  student_name?: string;
  student_email?: string;
  student_roll_number?: string;
  student_department?: string;
  subject_name?: string;
  subject_code?: string;
}
