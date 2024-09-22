import { useEffect, useState } from "react";

interface WebSocketHook {
  messages: string[];
  sendMessage: (message: string) => void;
}

export const useWebSocket = (url: string): WebSocketHook => {
  const [messages, setMessages] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("WebSocket connected.");
    };

    socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected.");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  return { messages, sendMessage };
};
