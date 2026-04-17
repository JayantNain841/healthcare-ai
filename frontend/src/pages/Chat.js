import React from "react";
import ChatContainer from "../components/ChatContainer";

export default function Chat() {
  return (
    <div className="bg-slate-900 min-h-screen text-white">

      <div className="max-w-5xl mx-auto">
        <ChatContainer />
      </div>
    </div>
  );
}