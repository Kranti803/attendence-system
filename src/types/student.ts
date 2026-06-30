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
  semester: number;
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
  year: number;
  semester: number;
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
