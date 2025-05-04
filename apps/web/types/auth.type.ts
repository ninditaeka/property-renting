export interface RegistrationResponse {
  token?: string;
  userId?: string;
  email?: string;
  role?: string;
  // Add other relevant fields specific to your authentication response
}

export type Roles = 'tenant' | 'customer';

export interface RegistrationRequest {
  email: string;
  role: string;
}

export interface RegistrationCustomer {
  email?: string;
  name?: string;
  role?: string;
  date_birth?: string;
  address?: string;
  gender?: string;
  phone?: string;
  id_number?: string;
  password?: string;
  photo?: string;
}

export interface RegistrationTenant {
  email?: string;
  name?: string;
  role?: string;
  date_birth?: string;
  address?: string;
  gender?: string;
  phone?: string;
  id_number?: string;
  password?: string;
  bank_account?: string;
  bank_name?: string;
  npwp?: string;
  photo?: string;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}
