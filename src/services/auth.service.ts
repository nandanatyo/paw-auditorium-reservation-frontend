import api from "./api";
import config from "../config/config";
import {
  AuthResponse,
  LoginRequest,
  RegisterOTPRequest,
  CheckOTPRequest,
  RegisterRequest,
  ResetPasswordOTPRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
} from "../types";
import {
  setAccessToken,
  setRefreshToken,
  clearAuthTokens,
  getRefreshToken,
} from "../utils/storage";

export const authService = {

  requestRegisterOTP: async (data: RegisterOTPRequest): Promise<void> => {
    await api.post(config.endpoints.auth.registerOtp, data);
  },


  checkRegisterOTP: async (data: CheckOTPRequest): Promise<void> => {
    await api.post(config.endpoints.auth.checkRegisterOtp, data);
  },


  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      config.endpoints.auth.register,
      data
    );
    const { access_token, refresh_token } = response.data;

    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    return response.data;
  },


  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      config.endpoints.auth.login,
      data
    );
    const { access_token, refresh_token } = response.data;

    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    return response.data;
  },


  refreshToken: async (): Promise<AuthResponse> => {
    const refresh_token = getRefreshToken();
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }

    const response = await api.post<AuthResponse>(
      config.endpoints.auth.refresh,
      {
        refresh_token,
      } as RefreshTokenRequest
    );

    const { access_token, refresh_token: new_refresh_token } = response.data;

    setAccessToken(access_token);
    setRefreshToken(new_refresh_token);

    return response.data;
  },


  logout: async (): Promise<void> => {
    try {
      await api.post(config.endpoints.auth.logout);
    } finally {
      clearAuthTokens();
    }
  },


  requestResetPasswordOTP: async (
    data: ResetPasswordOTPRequest
  ): Promise<void> => {
    await api.post(config.endpoints.auth.resetPasswordOtp, data);
  },


  resetPassword: async (data: ResetPasswordRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      config.endpoints.auth.resetPassword,
      data
    );
    const { access_token, refresh_token } = response.data;

    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    return response.data;
  },
};
