"use client";

import { useState } from "react";
import { getAiResponse } from "../test/action";

export default function Form(){
     const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);

  const [isDisable, setIsDisable] = useState(false);
  const [input, setInput] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // chặn reload trang
    setIsDisable(true);
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");


    const res = await getAiResponse(userMessage.text);
    const botMessage = { sender: "bot", text: res ?? "Xin lỗi, tôi không hiểu." };
    setMessages(prev => [...prev, botMessage]);
    setIsDisable(false);
  };

      return (
    <main className="chat-container">
      <div className="chat-history" id="chat-history">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}
          style={{ whiteSpace: "pre-wrap" }}>
            {msg.text}
          </div>
        ))}
        
      </div>
      <form className="chat-input-form" id="chat-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input value={input} type="text" id="chat-input" className="form-control" placeholder="Nhập tin nhắn của bạn..." 
          onChange={(e) => setInput(e.target.value)}></input>
          <button disabled={isDisable} className="btn btn-primary" type="submit" id="send-button">
            {
              (isDisable ? <i className="bi bi-arrow-repeat"></i> : <i className="bi bi-send-fill"></i>)
            }
          </button>
        </div>
      </form>
    </main>
  );
}