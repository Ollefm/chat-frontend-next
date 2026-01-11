"use client";

import TextBox from "@/components/TextBox";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useWebSocket } from "@/hooks/useWebsockets";
import { useUIStore } from "@/store/uiStore";
import { useChat } from "@/hooks/useChat";
import Search from "@/components/Search";

export default function ChatPage() {
  const { user } = useAuthStore();
  const { messages, currentChat, isLoadingMessages, chatId } = useChat();
  const { isSidebarMinified } = useUIStore();

  const [input, setInput] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { sendMessage, connected } = useWebSocket({ chatId });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="flex h-dvh overflow-hidden">
      <Search />
      <div
        className={`flex flex-col flex-1 transition-all duration-300
        ${isSidebarMinified ? "md:ml-20" : "md:ml-64"}
      `}
      >
        <header className="flex items-center justify-center h-16 text-center font-medium">
          Chat with{" "}
          {user?.id === currentChat?.user1_id
            ? currentChat?.username2
            : currentChat?.username1}
        </header>

        <div className="relative flex flex-col h-dvh">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-dvh">
              Loading messages
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pb-[10vh]">
              <div className="mx-auto py-2 max-w-3xl px-4 space-y-3">
                {messages.map((msg, i) => {
                  const mine = msg.sender_id === user?.id;

                  return (
                    <div
                      key={i}
                      className={`flex ${
                        mine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 break-words
              ${
                mine
                  ? "bg-gray-200 dark:bg-stone-800 border-[0.5] dark:border-stone-600 border-stone-400 max-w-[50%] rounded-2xl"
                  : "w-full"
              }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                {!connected && (
                  <div className="flex items-center px-4 py-2 w-full">
                    <div className="w-6 h-6 border-2 dark:border-white/20 dark:border-t-white border-black/20 border-t-black rounded-full animate-spin"></div>
                    <span className="ml-2 break-words text-sm text-stone-500 animate-pulse">
                      Connecting…
                    </span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>
          )}

          <div className="sticky bottom-0 bg-transparent pb-4 px-4 flex justify-center">
            <TextBox
              text={input}
              setText={setInput}
              onSend={() => {
                if (!input.trim()) return;
                sendMessage(input);
                setInput("");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
