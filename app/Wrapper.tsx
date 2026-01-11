"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import Sidebar from "@/components/Sidebar";
import { Navbar } from "@/components/Navbars";

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { initialize, isInitialized, isAuthenticated, user, logout } =
    useAuthStore();
  const { initializeTheme, isSidebarMinified, toggleSidebar, toggleSearch } =
    useUIStore();

  useEffect(() => {
    initialize();
    initializeTheme();
  }, [initialize, initializeTheme]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex h-dvh overflow-hidden bg-background">
        <Sidebar
          isMinified={isSidebarMinified}
          onToggle={toggleSidebar}
          onSearch={toggleSearch}
          logout={logout}
          username={user?.username || "User"}
        />
        <main className="flex-1 h-full overflow-y-auto relative">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-background">
      <Navbar />
      {children}
    </div>
  );
}
