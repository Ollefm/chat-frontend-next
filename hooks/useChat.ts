import { useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChatStore, Chat } from "@/store/chatStore";
import { useMessagesStore, Message } from "@/store/messageStore";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/config/constants";
import { UserResult } from "@/types/user";

export function useChat() {
  const params = useParams<{ chatId: string }>();
  const chatId = params?.chatId ?? "";

  const router = useRouter();
  const { user } = useAuthStore();

  const { chats, addChat, setActiveChat } = useChatStore();
  const { messages, setMessages, reset } = useMessagesStore();

  const currentChat = useMemo<Chat | undefined>(
    () => chats.find((c) => c.id === chatId),
    [chats, chatId]
  );

  const ensureChatLoaded = useCallback(async () => {
    if (!chatId || !user || currentChat) return;

    try {
      const chat = await apiClient.get<Chat>(
        `${API_ENDPOINTS.CHATS.INFO}?chat_id=${encodeURIComponent(chatId)}`
      );
      addChat(chat);
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  }, [chatId, user, currentChat, addChat]);

  const loadMessages = useCallback(async () => {
    if (!chatId || !user) return;

    try {
      const loadedMessages = await apiClient.get<Message[]>(
        `${API_ENDPOINTS.CHATS.HISTORY}?chat_id=${encodeURIComponent(chatId)}`
      );
      if (loadedMessages === null) {
        setMessages([]);
        return;
      }
      setMessages(loadedMessages);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }, [chatId, user, setMessages]);

  useEffect(() => {
    if (!chatId || !user) return;

    setActiveChat(chatId);
    ensureChatLoaded();
    loadMessages();

    return () => {
      setActiveChat(null);
      reset(); // clear messages on unmount
    };
  }, [chatId, user, setActiveChat, ensureChatLoaded, loadMessages, reset]);

  const startChat = useCallback(
    async (targetUser: UserResult) => {
      if (!user) return;

      try {
        const newChat = await apiClient.post<{
          id: string;
          created_at: string;
        }>(API_ENDPOINTS.CHATS.INITIATE, {
          target_user_id: targetUser.id,
        });

        addChat({
          id: newChat.id,
          user1_id: user.id,
          username1: user.username,
          user2_id: targetUser.id,
          username2: targetUser.username,
          created_at: newChat.created_at ?? new Date().toISOString(),
        });

        router.push(`/${newChat.id}`);
      } catch (error) {
        console.error("Failed to start chat:", error);
        throw error;
      }
    },
    [user, addChat, router]
  );

  return {
    chatId,
    currentChat,
    messages, // comes from messages store
    startChat,
  };
}
