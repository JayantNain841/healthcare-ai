import React, { useState } from "react";
import axios from "axios";

function Chat() {

  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {

    const response = await axios.post("http://localhost:5000/chat", {
      message: message
    });

    setReply(response.data.reply);
  };

  return (
    <div style={{ padding: "40px" }}>

      <h2>Healthcare AI Assistant</h2>

      <input
        type="text"
        placeholder="Ask a medical question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "400px", padding: "10px" }}
      />

      <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "10px" }}>
        Ask AI
      </button>

      <div style={{ marginTop: "20px" }}>
        <strong>AI Response:</strong>
        <p>{reply}</p>
      </div>

    </div>
  );
}

export default Chat;