import React, { useEffect, useRef, useState } from "react";
import "../css/chatbot-modal.css";

function getReply(message) {
    const text = message.toLowerCase();

    if (text.includes("book") || text.includes("rent")) {
        return "To book a vehicle, browse listings, choose a vehicle, view details, and continue to booking.";
    }

    if (text.includes("payment") || text.includes("pay") || text.includes("khalti")) {
        return "You can pay from the payment page. Select Khalti, complete payment, and your booking will be confirmed.";
    }

    if (text.includes("order")) {
        return "You can see your booking status from the Orders page.";
    }

    if (text.includes("vehicle") || text.includes("car") || text.includes("bike")) {
        return "You can browse available vehicles from the Listing page.";
    }

    if (text.includes("cancel")) {
        return "For cancellation, please check your Orders page or contact support.";
    }

    return "I can help with bookings, vehicles, payments, Khalti, orders, and cancellations.";
}

export default function ChatbotModal({ open, onClose }) {
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hi! I am your vehicle rental assistant. How can I help?",
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
                text: getReply(cleanInput),
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
