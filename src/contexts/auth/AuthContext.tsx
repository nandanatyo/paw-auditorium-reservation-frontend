import { createContext } from "react";
import { User } from "../../types";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login?: (email: string, password: string) => Promise<void>;
  register?: (
    email: string,
    otp: string,
    name: string,
    password: string
  ) => Promise<void>;
  requestRegisterOTP?: (email: string) => Promise<void>;
  logout?: () => Promise<void>;
  requestResetPasswordOTP?: (email: string) => Promise<void>;
  resetPassword?: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  requestRegisterOTP: async () => {},
  logout: async () => {},
  requestResetPasswordOTP: async () => {},
  resetPassword: async () => {},
});
