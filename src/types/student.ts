export interface CreateStudentPayload {
  first_name: string;
  last_name: string;
  phone_no: string;
  address: string;
  roll_number: string;
  department: string;
  year: number;
  user: string;
  photos: File[]; // 5 images
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  phone_no: string;
  address: string;
  roll_number: string;
  department: string;
  year: number;
  user: string;
}
