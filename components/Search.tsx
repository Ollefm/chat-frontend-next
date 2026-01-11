"use client";
import { useState } from "react";
import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/config/constants";
import { UserResult } from "@/types/user";
import { useChat } from "@/hooks/useChat";
import { useUIStore } from "@/store/uiStore";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [noResult, setNoResult] = useState<boolean>(false);
  const { toggleSearch, searchOpen } = useUIStore();
  const { startChat } = useChat();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const users = await apiClient.get<UserResult[]>(
        `${API_ENDPOINTS.USERS.SEARCH}?q=${encodeURIComponent(query)}`
      );
      setResults(users);
      if (users.length > 0) {
        setNoResult(false);
      } else {
        setNoResult(true);
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
      setNoResult(true);
    }
  };

  const handleStartChat = async (clickedUser: UserResult) => {
    try {
      await startChat(clickedUser);
    } catch (error) {
      console.error("Failed to start chat", error);
    } finally {
      toggleSearch();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      toggleSearch();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-100 bg-black/10 backdrop-blur-xs flex items-center justify-center p-4 ${
        searchOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <div className="w-full max-w-2xl bg-white/80 dark:bg-stone-900/80 rounded-2xl shadow-xl border-[0.5] border-gray-200 dark:border-stone-700 overflow-hidden">
        <div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <SearchIcon size={20} className="text-gray-400" />
            </span>
            <form onSubmit={handleSearch}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-4 pl-12 border-b border-gray-200 dark:border-stone-600 focus:outline-none"
                placeholder="Search for users..."
                autoFocus
                type="text"
              />
            </form>
          </div>

          <div className="max-h-96 overflow-y-auto overflow-x-hidden">
            <ul>
              {results?.map((user) => (
                <li key={user.id} className="group py-5 px-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-stone-700 text-gray-600 dark:text-stone-300">
                        <span className="text-xs font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">{user.username}</span>
                    </div>
                    <button
                      onClick={() => handleStartChat(user)}
                      className="cursor-pointer px-6 py-2 bg-gray-900 dark:bg-stone-100 text-white dark:text-black rounded-lg text-sm font-medium whitespace-nowrap"
                    >
                      Start Chat
                    </button>
                  </div>
                </li>
              ))}

              {noResult && query && (
                <li className="text-gray-500 dark:text-stone-400 py-4 text-center">
                  No users found
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
