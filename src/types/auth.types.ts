export type UserRole = "user" | "admin" | "event_coordinator";

export interface User {
  id: string | null;
  name: string | null;
  email: string | null;
  role: UserRole | null;
  bio: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface RegisterOTPRequest {
  email: string;
}

export interface CheckOTPRequest {
  email: string;
  otp: string;
}

export interface RegisterRequest {
  email: string;
  otp: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ResetPasswordOTPRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}
