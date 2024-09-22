import React, { useEffect, useState } from "react";

export const Chat: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WS_URL!);
    ws.onopen = () => {
      console.log("Connected to server");
    };

    ws.onmessage = (event) => {
      const messageData = event.data;

      // Verificar se o dado recebido é um Blob
      if (messageData instanceof Blob) {
        // Converta o Blob em texto antes de renderizar
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result as string;
          setMessages((prev) => [...prev, text]);
        };
        reader.readAsText(messageData);
      } else {
        // Se não for Blob, renderize diretamente (provavelmente string)
        setMessages((prev) => [...prev, messageData]);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
    };

    setSocket(ws);

    // Limpeza da conexão ao desmontar o componente
    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && input) {
      socket.send(input);
      setInput(""); // Limpa o campo de input
    }
  };

  return (
    <div>
      <h1>Chat WebSocket</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite sua mensagem"
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};
