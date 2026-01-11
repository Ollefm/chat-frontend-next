import { useMessagesStore } from "@/store/messageStore";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { WS_BASE_URL } from "@/config/constants";

export function useWebSocket({ chatId }: { chatId: string }) {
  const { user } = useAuthStore();
  const { addMessage } = useMessagesStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user || !chatId) return;

    const connect = () => {
      const ws = new WebSocket(
        `${WS_BASE_URL}?chat_id=${encodeURIComponent(chatId)}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WS Connected");
        setConnected(true);
      };

      ws.onmessage = (e) => {
        console.log("WS Received:", e.data);
        try {
          addMessage(JSON.parse(e.data));
        } catch {
          console.warn("WS Non-JSON message:", e.data);
        }
      };

      ws.onclose = (event) => {
        console.log(`WS Closed (code: ${event.code})`);
        setConnected(false);

        // Only reconnect if not a normal closure (code 1000)
        if (event.code !== 1000) {
          console.log("WS Reconnecting in 3s...");
          reconnectTimeoutRef.current = setTimeout(connect, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error("WS Error:", error);
        ws.close();
      };
    };

    connect();

    return () => {
      console.log("WS Cleanup");
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting"); // Normal closure
      }
    };
  }, [user, chatId]);

  const sendMessage = (content: string) => {
    if (!user) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content, sender_id: user.id }));
      console.log("WS Sent:", { content, sender_id: user.id });
    } else {
      console.warn("WS Cannot send, something went wrong");
    }
  };

  return { sendMessage, connected };
}
