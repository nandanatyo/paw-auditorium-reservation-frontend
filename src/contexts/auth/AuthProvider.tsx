import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../../services/auth.service";
import { userService } from "../../services/user.service";
import {
  User,
  LoginRequest,
  RegisterRequest,
  RegisterOTPRequest,
  CheckOTPRequest,
  ResetPasswordOTPRequest,
  ResetPasswordRequest,
} from "../../types";
import { getAccessToken, isAuthenticated } from "../../utils/storage";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  requestRegisterOTP: (email: string) => Promise<void>;
  checkRegisterOTP: (email: string, otp: string) => Promise<void>;
  requestResetPasswordOTP: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated()) {
          const userData = await userService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestRegisterOTP = async (email: string) => {
    await authService.requestRegisterOTP({ email });
  };

  const checkRegisterOTP = async (email: string, otp: string) => {
    await authService.checkRegisterOTP({ email, otp });
  };

  const requestResetPasswordOTP = async (email: string) => {
    await authService.requestResetPasswordOTP({ email });
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword(data);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        requestRegisterOTP,
        checkRegisterOTP,
        requestResetPasswordOTP,
        resetPassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
