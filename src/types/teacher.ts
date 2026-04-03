export interface CreateTeacherPayload {
  first_name: string;
  last_name: string;
  phone_no: string;
  address: string;
  employee_id: string;
  department: string;
  email: string;
  password: string | number; // API indicates number, but string is typical; allowing both
}

export interface Teacher {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone_no?: string;
  department?: string;
  employee_id?: string;
  status?: string;
}
