import Link from "next/link";
import { useState } from "react";
import { Moon, Sun, Search, Menu } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { RecentChatsForSidebar } from "./RecentChats";

interface SidebarProps {
  isMinified: boolean;
  onToggle: () => void;
  onSearch: () => void;
  logout: () => void;
  username?: string;
}

export default function Sidebar({
  isMinified,
  onToggle,
  onSearch,
  logout,
  username,
}: Readonly<SidebarProps>) {
  const [dropdown, setDropdown] = useState(false);
  const { isDarkMode, toggleTheme } = useUIStore();

  let initial = "undefined";
  if (username) {
    initial = username.charAt(0).toUpperCase();
  }
  return (
    <>
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isMinified
            ? "opacity-0 invisible pointer-events-none"
            : "opacity-100 visible"
        }`}
        onClick={onToggle}
        aria-hidden="true"
      />
      {isMinified && (
        <button
          onClick={onToggle}
          aria-label="Open sidebar"
          className="
      fixed top-3 left-3 z-50
      flex items-center justify-center
      p-2
      rounded-full
      dark:hover:bg-stone-900
      hover:bg-gray-100
      transition
      cursor-pointer
      md:hidden
    "
        >
          <Menu />
        </button>
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col border-r backdrop-blur-md dark:border-stone-800 border-gray-200 
          transition-all duration-300 ease-in-out 
          ${isMinified ? "-translate-x-full" : "translate-x-0"}
          w-64 
          md:translate-x-0 
          ${isMinified ? "md:w-20" : "md:w-64"}
        `}
        aria-label="Sidebar"
      >
        <header
          className={`h-16 flex items-center ${
            isMinified ? "justify-center px-0" : "justify-between px-4"
          }`}
        >
          <button
            onClick={onToggle}
            className={`flex justify-center items-center dark:hover:bg-stone-900 hover:bg-gray-100 rounded-full p-2 cursor-pointer ${
              isMinified ? "mx-auto" : ""
            }`}
            aria-label="Toggle sidebar"
          >
            <Menu />
          </button>
        </header>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 custom-scrollbar">
          <div
            className={
              isMinified ? "justify-center px-4" : "justify-between px-4"
            }
          >
            <button
              onClick={onSearch}
              className={`w-full flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800 text-sm font-medium cursor-pointer 
                ${isMinified ? "justify-center" : "gap-2"}`}
              title="Search"
            >
              <Search />
              {!isMinified && <span>Search</span>}
            </button>
          </div>

          <div className="flex flex-col px-3">
            {!isMinified && (
              <p className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Recent Chats
              </p>
            )}
            <RecentChatsForSidebar minified={isMinified} />
          </div>
        </nav>

        <footer
          className={`border-t dark:border-stone-800 ${
            isMinified ? "flex flex-col justify-center items-center" : " "
          } border-gray-300 p-2 flex-shrink-0`}
        >
          <button
            onClick={toggleTheme}
            className={`${
              isMinified ? "" : "ml-1"
            } p-2 rounded-full cursor-pointer
                       border-2 border-transparent hover:border-stone-700 dark:hover:border-stone-300
                      `}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="relative">
            {dropdown && (
              <div
                id="dropdownHover"
                className={`
                  absolute bottom-full mb-2 z-100 dark:bg-stone-900 bg-white border dark:border-stone-700 border-gray-200 rounded-lg shadow-lg overflow-hidden
                  ${isMinified ? "left-0 w-48" : "left-0 w-full"}
                `}
              >
                <Link
                  href={"/"}
                  className="block px-4 py-2.5 text-sm"
                  onClick={logout}
                >
                  Sign out
                </Link>
              </div>
            )}
            <button
              onClick={() => setDropdown(!dropdown)}
              className={`w-full flex items-center p-2 rounded-lg dark:hover:bg-stone-900 hover:bg-gray-50 cursor-pointer ${
                isMinified ? "justify-center" : "gap-3"
              }`}
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-black to-gray-500 text-white font-bold text-sm flex-shrink-0 shadow-sm">
                {initial}
              </div>

              <div
                className={`flex flex-col min-w-0 text-left duration-300 ${
                  isMinified
                    ? "w-0 opacity-0 overflow-hidden"
                    : "w-auto opacity-100"
                }`}
              >
                <span className="font-medium text-sm truncate">{username}</span>
              </div>
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
}
