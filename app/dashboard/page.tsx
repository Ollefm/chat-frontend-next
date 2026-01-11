"use client";

import { useState, useEffect } from "react";
import Search from "@/components/Search";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { RecentChatsForDashboard } from "@/components/RecentChats";
import { ChevronRight } from "lucide-react";

export default function Dashboard() {
  const { user, initialize } = useAuthStore();
  const { initializeTheme, isSidebarMinified, toggleSearch } = useUIStore();

  useEffect(() => {
    initializeTheme();
    initialize();
  }, []);

  const greetings = [
    "What's up",
    "How's it going",
    "Hey there",
    "Good to see you",
    "Welcome back",
    "Nice to have you here",
    "How are you doing",
  ];

  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const username = user?.username || "Guest";

  // Typing animation
  useEffect(() => {
    const currentPhrase = greetings[index] + ", " + username + "!";

    if (charIndex < currentPhrase.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 60);

      return () => clearTimeout(timeout);
    } else {
      // After a full phrase is written, wait then switch to next
      const timeout = setTimeout(() => {
        setCharIndex(0);
        setIndex((prev) => (prev + 1) % greetings.length);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, index, username]);

  return (
    <main className="flex-1 overflow-hidden">
      <div className="flex h-dvh overflow-hidden relative">
        <Search />
        <div
          className={`flex flex-col flex-1 transition-all duration-300 relative z-10 ${
            isSidebarMinified ? "md:ml-20" : "md:ml-60"
          }`}
        >
          <main className="flex flex-col justify-between h-full p-6 pt-20">
            <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full space-y-10">
              <div className="text-center space-y-4">
                <h1 className="font-regular text-4xl md:text-6xl tracking-tight">
                  {displayText}
                </h1>
              </div>

              <button
                onClick={toggleSearch}
                className="group relative inline-flex items-center justify-center px-6 py-2 md:px-8 md:py-3 font-semibold text-white transition-all duration-200 dark:bg-stone-100 dark:text-black bg-gray-900 rounded-full active:scale-95 cursor-pointer"
              >
                <span className="mr-2 text-lg">Start a chat</span>
                <ChevronRight />
              </button>

              <RecentChatsForDashboard></RecentChatsForDashboard>
            </div>
          </main>
        </div>
      </div>
    </main>
  );
}
