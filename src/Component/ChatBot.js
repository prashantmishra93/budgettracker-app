import { useState } from "react";
import { makeApiRequest, respStatus, url, showMessage } from '../helper/api_helper';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    // Add user message
    const newMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, newMsg]);

    const res = await makeApiRequest(url.USER_API.chatboot, {}, url.API_EXTENSION)
    console.log("response ai ====>", res)

    const botReply = res.data.reply;

    setMessages(prev => [...prev, { sender: "bot", text: botReply }]);

    setInput("");
  };

  return (
    <div style={{ width: "400px", padding: "20px", border: "1px solid #ccc" }}>
      <h3>AI Budget Assistant</h3>

      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ddd", padding: "10px" }}>
        {messages.map((msg, i) => (
          <p key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <b>{msg.sender}:</b> {msg.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your budget..."
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
