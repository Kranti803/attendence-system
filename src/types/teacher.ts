export interface CreateTeacherPayload {
  first_name: string;
  last_name: string;
  phone_no: string;
  address: string;
  employee_id: string;
  department: string;
  email: string;
  password: string | number;
}

export interface UpdateTeacherPayload {
  first_name?: string;
  last_name?: string;
  phone_no?: string | null;
  address?: string | null;
  employee_id?: string;
  department?: string | null;
}

export interface Teacher {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone_no?: string | null;
  address?: string | null;
  department?: string | null;
  employee_id?: string;
  status?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
