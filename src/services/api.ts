import axios, { AxiosError, AxiosRequestConfig } from "axios";
import config from "../config/config";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAuthTokens,
} from "../utils/storage";
import {
  ApiError,
  ErrorResponse,
  RefreshTokenRequest,
  AuthResponse,
} from "../types";

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken() &&
      error.response.data?.error_code !== "INVALID_REFRESH_TOKEN" &&
      error.response.data?.error_code !== "NO_BEARER_TOKEN"
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        const response = await axios.post<AuthResponse>(
          `${config.apiUrl}/auth/refresh`,
          { refresh_token: refreshToken } as RefreshTokenRequest
        );

        const { access_token, refresh_token } = response.data;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return axios(originalRequest);
      } catch (refreshError) {
        clearAuthTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    const apiError = new ApiError(
      error.response?.data?.message || error.message,
      error.response?.status,
      error.response?.data
    );

    return Promise.reject(apiError);
  }
);

export default api;
