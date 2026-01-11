import { create } from "zustand";
import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/config/constants";

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    try {
      set({ isLoading: true });

      const data = await apiClient.get<{ user: User }>(API_ENDPOINTS.AUTH.ME);

      set({
        user: data.user,
        isAuthenticated: true,
        isInitialized: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (username, password) => {
    try {
      set({ isLoading: true });

      const data = await apiClient.post<{ user: User }>(
        API_ENDPOINTS.AUTH.LOGIN,
        { username, password }
      );

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  register: async (username, password) => {
    try {
      set({ isLoading: true });
      await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        username,
        password,
      });
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
      });
      globalThis.location.href = "/";
    }
  },
}));
