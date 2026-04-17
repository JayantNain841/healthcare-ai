import React, { useState } from "react";

const ChatInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");

  // ✅ Send text message
  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSend(message);
    setMessage("");
  };

  // ✅ Handle file upload
  const handleFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5001/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // 🔥 Send file as message (important)
      onSend(`uploads/${data.file}`);

    } catch (err) {
      console.error("File upload failed");
    }
  };

  return (
    <div className="p-4 border-t border-slate-700 bg-slate-900 flex gap-2 items-center">

      {/* 📎 File Upload */}
      <label className="cursor-pointer bg-slate-700 px-3 py-2 rounded-lg hover:bg-slate-600">
        📎
        <input
          type="file"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
          disabled={disabled}
        />
      </label>

      {/* 💬 Text Input */}
      <input
        className="flex-1 p-3 rounded-lg bg-slate-800 text-white outline-none"
        placeholder="Ask a healthcare question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={disabled}
      />

      {/* 🚀 Send Button */}
      <button
        onClick={handleSend}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg text-white ${
          disabled
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;