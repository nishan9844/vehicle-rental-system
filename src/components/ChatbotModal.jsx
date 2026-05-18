import React, { useEffect, useRef, useState } from "react";
import "../css/chatbot-modal.css";

const SYSTEM_PROMPT = `
You are Vental's vehicle rental support assistant.
Only answer questions about Vental vehicles, bookings, payments, orders, cancellations, documents, and rental policies.
Do not ask for passwords, OTPs, full card numbers, secret keys, or admin credentials.
Do not promise that a vehicle is booked until payment and confirmation are complete.
For account, payment, or cancellation issues that need private data, tell the user to use Orders or contact support.
Keep answers short, helpful, and safe.
`;

const OFF_TOPIC_PATTERNS = [
    "password",
    "otp",
    "secret",
    "api key",
    "hack",
    "bypass",
    "admin login",
    "credit card number",
];

function getReply(message) {
    void SYSTEM_PROMPT;
    const text = message.toLowerCase();

    if (OFF_TOPIC_PATTERNS.some((pattern) => text.includes(pattern))) {
        return "I cannot help with passwords, OTPs, card numbers, secret keys, or admin access. For account or payment help, please use the official login, Orders page, or contact support.";
    }

    if (
        ![
            "book", "rent", "vehicle", "car", "bike", "payment", "pay", "khalti",
            "order", "cancel", "price", "document", "license", "pickup", "return",
            "available", "availability", "deposit", "support", "hello", "hi"
        ].some((keyword) => text.includes(keyword))
    ) {
        return "I can help only with Vental vehicle rentals, bookings, payments, orders, cancellations, documents, and availability.";
    }

    if (text.includes("book") || text.includes("rent")) {
        return "To book a vehicle, browse listings, choose an available vehicle, pick dates, enter your details, and complete payment. A vehicle is confirmed only after payment/confirmation.";
    }

    if (text.includes("payment") || text.includes("pay") || text.includes("khalti")) {
        return "You can pay from the payment page using card or Khalti. Never share passwords, OTPs, or full card details in chat.";
    }

    if (text.includes("order")) {
        return "You can see your booking status from the Orders page.";
    }

    if (text.includes("vehicle") || text.includes("car") || text.includes("bike")) {
        return "You can browse available vehicles from the Listing page. Vehicle availability is checked again before payment.";
    }

    if (text.includes("cancel")) {
        return "For cancellation, please check your Orders page or contact support.";
    }

    return "I can help with bookings, vehicles, payments, Khalti, orders, cancellations, documents, and availability.";
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
