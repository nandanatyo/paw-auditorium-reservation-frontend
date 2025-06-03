import config from "../config/config";

export const getAccessToken = (): string | null => {
  return localStorage.getItem(config.tokenStorageKey);
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem(config.tokenStorageKey, token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(config.refreshTokenStorageKey);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(config.refreshTokenStorageKey, token);
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem(config.tokenStorageKey);
  localStorage.removeItem(config.refreshTokenStorageKey);
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
