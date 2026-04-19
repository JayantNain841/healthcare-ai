import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const API_URL = process.env.REACT_APP_API_URL;

const ChatContainer = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your Healthcare AI assistant." },
  ]);

  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/chat-history`);
        const data = await res.json();

        if (data.length > 0) {
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to load history");
      }
    };

    loadHistory();
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Send message
  const sendMessage = async (text) => {
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    if (text.startsWith("uploads/")) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const aiMsg = {
        role: "assistant",
        content: data.response || "No response",
      };

      setMessages((prev) => [...prev, aiMsg]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠ Error connecting to server" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Clear chat
  const clearChat = async () => {
    const confirmClear = window.confirm("Clear all chat history?");
    if (!confirmClear) return;

    try {
      await fetch(`${API_URL}/chat-history`, {
        method: "DELETE",
      });

      setMessages([
        { role: "assistant", content: "Chat cleared. How can I help you?" },
      ]);
    } catch (err) {
      console.error("Failed to clear chat");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-900">

      {/* Clear Chat */}
      <div className="p-2 flex justify-end">
        <button
          onClick={clearChat}
          className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <div className="flex justify-start my-2">
            <div className="bg-slate-700 text-white px-4 py-2 rounded-2xl text-sm">
              Typing...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
};

export default ChatContainer;