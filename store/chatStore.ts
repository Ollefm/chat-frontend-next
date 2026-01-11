import { create } from "zustand";

export interface Chat {
  id: string;
  user1_id: string;
  username1: string;
  user2_id: string;
  username2: string;
  created_at: string;
}

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;

  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (id: string, updates: Partial<Chat>) => void;
  setActiveChat: (id: string | null) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChatId: null,

  setChats: (chats) => set({ chats }),

  addChat: (chat) =>
    set((state) => ({
      chats: [chat, ...state.chats],
    })),

  updateChat: (id, updates) =>
    set((state) => ({
      chats: state.chats.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  setActiveChat: (id) => set({ activeChatId: id }),

  reset: () =>
    set({
      chats: [],
      activeChatId: null,
    }),
}));
