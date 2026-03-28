export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthUser {
  id: number,
  email: string,
  is_active: boolean,
  user_type: string,
  created_at: string,
  updated_at: string,
  first_name: string | null,
  last_name: string | null,
  phone_no: string | null,
  address: string | null,
  user: number
}

export interface LoginResponse {
  access: string;
  refresh: string;
}
