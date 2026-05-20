import React, { useEffect, useRef, useState } from "react";
import "../css/chatbot-modal.css";
import { getChatbotReply, getInitialChatbotMessage } from "../services/chatbotService";

export default function ChatbotModal({ open, onClose }) {
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: getInitialChatbotMessage(),
        },
    ]);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!open) return null;

    const sendMessage = (e) => {
        e.preventDefault();

        const cleanInput = input.trim();

        if (!cleanInput) return;

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: cleanInput,
            },
            {
                sender: "bot",
                text: getChatbotReply(cleanInput),
            },
        ]);

        setInput("");
    };

    return (
        <div className="chatbot-overlay">
            <div className="chatbot-modal">
                <div className="chatbot-header">
                    <div>
                        <h2>Ask Agents</h2>
                        <p>Vehicle rental support assistant</p>
                    </div>

                    <button type="button" onClick={onClose} className="chatbot-close">
                        X
                    </button>
                </div>

                <div className="chatbot-messages">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`chatbot-message ${message.sender === "user" ? "user" : "bot"
                                }`}
                        >
                            <div className="chatbot-bubble">{message.text}</div>
                        </div>
                    ))}

                    <div ref={bottomRef} />
                </div>

                <form className="chatbot-input-row" onSubmit={sendMessage}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about bookings, payments, or vehicles..."
                    />

                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
}
