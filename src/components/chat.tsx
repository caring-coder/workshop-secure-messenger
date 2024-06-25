"use client";
import { useState } from "react";
import { type Message } from "@/types/Message";

export default function Chat({ sender }: { sender: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessages((messages) => [
      ...messages,
      { id: `message-${messages.length + 1}`, sender, message },
    ]);
    setMessage("");
  };

  return (
    <div className="chat-container">
      <div className="chat">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <strong>{message.sender}:</strong> {message.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          value={message}
          placeholder={`${sender}, what's up?`}
          onChange={(event) => setMessage(event.target.value)}
          className="chat-input"
        />
        <button type="submit" className="chat-submit">
          Send
        </button>
      </form>
    </div>
  );
}
