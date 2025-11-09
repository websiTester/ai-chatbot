"use client";

import { useState } from "react";
import { getAiResponse } from "../test/action";
import { AddUpdateResponse, getObsidianResponse2, saveTextInObsidian } from "../obsidian/action";

export default function Form({isOriginAgent}: {isOriginAgent: boolean}) {
     const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);

  const [isDisable, setIsDisable] = useState(false);
  const [input, setInput] = useState("");

  const [isSaved, setIsSaved] = useState<boolean[]>([]);

  const handleSave = async (index: number) => {
    isSaved[index] = true;
    setIsSaved([...isSaved]);
    const messageToSave = messages[index].text;
    //console.log("Lưu tin nhắn:", messageToSave);

    setIsDisable(true);
    var response = await saveTextInObsidian(messageToSave);
    const botMessage = { sender: "bot", text: response ?? "Xin lỗi, tôi không hiểu." };
    setMessages(prev => [...prev, botMessage]);
    setIsDisable(false);
    // await AddUpdateResponse({
    //   responseId : index + 1,
    //   response : messageToSave.text,
    //   isAlternate : false
    // })
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // chặn reload trang
    setIsDisable(true);
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    var res;
    if(isOriginAgent){
       res = await getAiResponse(userMessage.text);
    }else {
        res = await getObsidianResponse2(userMessage.text);
    }
    
    const botMessage = { sender: "bot", text: res ?? "Xin lỗi, tôi không hiểu." };
    setMessages(prev => [...prev, botMessage]);
    setIsDisable(false);
    await AddUpdateResponse({
      responseId : 1,
      response : res,
      isAlternate : true
    })
  };

      return (
    <main className="chat-container">
      <div className="chat-history" id="chat-history">
       {messages.map((msg, i) => (
  msg.sender === "bot" ? (
    <div
      key={i}
      className={`message ${msg.sender}`}
      style={{ whiteSpace: "pre-wrap" }}
    >
      <div className="message-content">{msg.text}</div>
      {
        !isOriginAgent && (
          <button onClick={() => handleSave(i)}
          className="btn btn-sm save-message-btn" title="Lưu tin nhắn" disabled={isSaved[i]} 
            style={{ backgroundColor: "#ddd", border: "1px solid #ccc" }}>
              <i className="bi bi-bookmark"></i>
              <i className="bi bi-bookmark-fill"></i>
              Lưu
          </button>
        )
      }
      
    </div>
  ) : (
    <div
      key={i}
      className={`message ${msg.sender}`}
      style={{ whiteSpace: "pre-wrap" }}
    >
      <div className="message-content">{msg.text}</div>
    </div>
  )
))}
        
      </div>
      <form className="chat-input-form" id="chat-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input value={input} type="text" id="chat-input" className="form-control" placeholder="Nhập tin nhắn của bạn..." 
          onChange={(e) => setInput(e.target.value)}></input> 
        </div>
        <button  disabled={isDisable} className="btn btn-primary" type="submit" id="send-button">
                {
              (isDisable ? <i className="bi bi-arrow-repeat"></i> : <i className="bi bi-send-fill"></i>)
            }
            </button>
      </form>
    </main>
  );
}