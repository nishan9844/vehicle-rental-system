import React, { useMemo, useRef, useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import "../css/chat.css";

const quickQuestions = [
    "How do I book a vehicle?",
    "How do I pay with Khalti?",
    "Can I cancel my booking?",
    "Where can I see my orders?",
];

function getBotReply(message) {
    const text = message.toLowerCase();

    if (text.includes("book") || text.includes("rent")) {
        return "To book a vehicle, open the listing page, choose a vehicle, view its details, then click the booking button. After filling the booking form, you can continue to payment.";
    }

    if (text.includes("khalti") || text.includes("payment") || text.includes("pay")) {
        return "You can pay from the payment page. Select Khalti, confirm your booking, and you will be redirected to Khalti. After payment, you will return to the app and your booking will be confirmed.";
    }

    if (text.includes("cancel")) {
        return "Cancellation depends on your project rules. Usually, you can manage bookings from the Orders page. If cancellation is not available there yet, it can be added as a new feature.";
    }

    if (text.includes("order") || text.includes("history")) {
        return "You can view your bookings and payment status from the Orders page.";
    }

    if (text.includes("vehicle") || text.includes("car") || text.includes("bike")) {
        return "You can browse available vehicles from the Listing page. Open any vehicle to see its details, price, and booking option.";
    }

    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
        return "Hello! I can help you with bookings, payments, vehicles, Khalti, and order status.";
    }

    if (text.includes("contact") || text.includes("support")) {
        return "For support, please contact the vehicle rental team through the contact details provided by the website owner.";
    }

    return "I can help with vehicle booking, Khalti payment, order status, cancellation, and vehicle availability. Try asking: How do I book a vehicle?";
}

export default function ChatPage() {
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hi! I am your vehicle rental assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const chatEndRef = useRef(null);

    const canSend = useMemo(() => input.trim().length > 0 && !typing, [input, typing]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    const sendMessage = (messageText = input) => {
        const cleanText = messageText.trim();

        if (!cleanText || typing) return;

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: cleanText,
            },
        ]);

        setInput("");
        setTyping(true);

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: getBotReply(cleanText),
                },
            ]);
            setTyping(false);
        }, 600);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    return (
        <>
            <Navbar />

            <main className="chat-page">
                <section className="chat-shell">
                    <div className="chat-header">
                        <div>
                            <h1>Chat Support</h1>
                            <p>Ask about bookings, payments, vehicles, and orders.</p>
                        </div>
                        <span className="chat-status">Online</span>
                    </div>

                    <div className="quick-questions">
                        {quickQuestions.map((question) => (
                            <button
                                key={question}
                                type="button"
                                onClick={() => sendMessage(question)}
                                disabled={typing}
                            >
                                {question}
                            </button>
                        ))}
                    </div>

                    <div className="chat-window">
                        {messages.map((message, index) => (
                            <div
                                key={`${message.sender}-${index}`}
                                className={`chat-message ${message.sender === "user" ? "user" : "bot"}`}
                            >
                                <div className="chat-bubble">{message.text}</div>
                            </div>
                        ))}

                        {typing && (
                            <div className="chat-message bot">
                                <div className="chat-bubble typing">Typing...</div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    <form className="chat-input-row" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question..."
                        />
                        <button type="submit" disabled={!canSend}>
                            Send
                        </button>
                    </form>
                </section>
            </main>

            <Footer />
        </>
    );
}
