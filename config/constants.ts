export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/api/ws";

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login/",
    REGISTER: "/auth/register/",
    LOGOUT: "/auth/logout/",
    ME: "/api/users/me/",
  },

  // User endpoints
  USERS: {
    SEARCH: "/api/users/search",
  },

  // Chat endpoints
  CHATS: {
    INITIATE: "/api/chat/initiatechat",
    HISTORY: "/api/chat/history/",
    INFO: "/api/chat/chatinfo/",
    LIST: "/api/chat/chatlist/",
  },
};

export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  credentials: "include", // Always include cookies for authentication
  headers: {
    "Content-Type": "application/json",
  },
};

export const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: "Bad request. Please check your input.",
  401: "Your session has expired. Please login again.",
  403: "You don't have permission to access this resource.",
  404: "Resource not found.",
  500: "Server error. Please try again later.",
  502: "Service unavailable. Please try again later.",
  503: "Service temporarily unavailable. Please try again later.",
};
