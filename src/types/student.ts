export interface CreateStudentPayload {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  phone_no: string;
  address: string;
  roll_number: string;
  department: string;
  year: number;
  images: File[];
}

export interface Student {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_no: string;
  address: string;
  roll_number: string;
  department: string;
  year: number | null;
  semester: number | null;
  is_active?: boolean;
  user_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateStudentPayload {
  first_name?: string;
  last_name?: string;
  phone_no?: string;
  address?: string;
  roll_number?: string;
  department?: string;
  year?: number;
  semester?: number;
}
