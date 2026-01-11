import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  isSidebarMinified: boolean;
  searchOpen: boolean;
  isDarkMode: boolean;
  toggleSidebar: () => void;
  toggleSearch: () => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      isSidebarMinified: true,
      searchOpen: false,
      isDarkMode: false,
      toggleSidebar: () =>
        set((s) => ({ isSidebarMinified: !s.isSidebarMinified })),
      toggleSearch: () =>
        set((s) => ({
          searchOpen: !s.searchOpen,
          isSidebarMinified: true,
        })),
      toggleTheme: () =>
        set((s) => {
          const newDarkMode = !s.isDarkMode;
          if (globalThis.window !== undefined) {
            if (newDarkMode) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          }
          return { isDarkMode: newDarkMode };
        }),
      initializeTheme: () => {
        if (globalThis.window !== undefined) {
          const currentState = get();
          if (currentState.isDarkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      },
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);
