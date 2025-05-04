export type UserRole = 'customer' | 'tenant';

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: User['role'];
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
