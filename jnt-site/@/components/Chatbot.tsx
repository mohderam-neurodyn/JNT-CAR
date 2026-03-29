"use client";

import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hello! I’m NeuroDyn’s AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Send message to API route
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "⚠️ Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg w-full max-w-md bg-white shadow-md">
      {/* Chat window */}
      <div className="h-64 overflow-y-auto border-b mb-2 p-2">
        {messages.map((msg, idx) => (
          <p
            key={idx}
            className={msg.role === "user" ? "text-right text-blue-600" : "text-left text-gray-800"}
          >
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </p>
        ))}
        {loading && <p className="text-gray-400 italic">AI is typing...</p>}
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
