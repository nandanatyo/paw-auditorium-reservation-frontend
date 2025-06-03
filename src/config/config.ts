const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  tokenStorageKey: "auditorium_access_token",
  refreshTokenStorageKey: "auditorium_refresh_token",
  pagination: {
    defaultLimit: 10,
    maxLimit: 20,
  },
  endpoints: {
    auth: {
      register: "/auth/register",
      registerOtp: "/auth/register/otp",
      checkRegisterOtp: "/auth/register/otp/check",
      login: "/auth/login",
      refresh: "/auth/refresh",
      logout: "/auth/logout",
      resetPasswordOtp: "/auth/reset-password/otp",
      resetPassword: "/auth/reset-password",
    },
    users: {
      base: "/users",
      me: "/users/me",
      byId: (id: string) => `/users/${id}`,
    },
    conferences: {
      base: "/conferences",
      byId: (id: string) => `/conferences/${id}`,
      status: (id: string) => `/conferences/${id}/status`,
    },
    registrations: {
      base: "/registrations",
      byConference: (id: string) => `/registrations/conferences/${id}`,
      byUser: (id: string) => `/registrations/users/${id}`,
    },
    feedbacks: {
      base: "/feedbacks",
      byConference: (id: string) => `/feedbacks/conferences/${id}`,
      byId: (id: string) => `/feedbacks/${id}`,
    },
  },
};

export default config;
