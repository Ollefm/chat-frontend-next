"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export function Navbar() {
  const { isDarkMode, toggleTheme } = useUIStore();

  return (
    <nav className="sticky top-0 z-20 backdrop-blur-xl px-10 py-5">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-regular tracking-tight text-black dark:text-white"
        >
          Just ChatApp
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm px-5 py-2 rounded-full font-medium
                       border-2 border-transparent hover:border-stone-700 dark:hover:border-stone-300"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="text-sm px-5 py-2 rounded-full font-medium  
                       border-2 border-transparent hover:border-stone-700 dark:hover:border-stone-300"
          >
            Register
          </Link>
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-full cursor-pointer
                       border-2 border-transparent hover:border-stone-700 dark:hover:border-stone-300
                       transition-all duration-300"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
