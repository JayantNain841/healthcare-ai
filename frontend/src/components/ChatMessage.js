import React from "react";

const ChatMessage = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div className={`flex my-2 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs ${
          isUser ? "bg-blue-600 text-white" : "bg-slate-700 text-white"
        }`}
      >
        {/* 🔥 IMAGE MESSAGE */}
        {typeof content === "string" && content.startsWith("uploads/") ? (
          <img
            src={`http://localhost:5001/${content}`}
            alt="uploaded"
            className="rounded-lg max-w-full"
          />
        ) : null}

        {/* ✅ NORMAL TEXT MESSAGE */}
        {typeof content === "string" && !content.startsWith("uploads/") && (
          <p>{content}</p>
        )}

        {/* 🔥 ML PREDICTION MESSAGE */}
        {typeof content === "object" && content.type === "prediction" && (
          <div>
            <p className="font-bold text-lg">
              Risk: {content.final_risk}
            </p>

            <p>
              Confidence: {(content.combined_score * 100).toFixed(1)}%
            </p>

            <div className="mt-2 bg-slate-800 p-2 rounded-lg">
              <p className="font-semibold text-sm">Why this prediction?</p>

              {content.explanations?.map((item, i) => (
                <p key={i} className="text-sm">• {item}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;