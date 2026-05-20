import React, { useMemo, useRef, useState, useEffect } from "react";
import "../css/chat.css";

const quickQuestions = [
    "How do I book a vehicle?",
    "How do I pay with Khalti?",
    "Can I cancel a booking?",
    "How do I add a new vehicle?",
];

function getBotReply(message) {
    const text = message.toLowerCase();
    if (text.includes("book") || text.includes("rent")) return "To create a booking, go to Bookings > New Rental. Select customer and vehicle, set dates, and submit.";
    if (text.includes("khalti") || text.includes("payment") || text.includes("pay")) return "Payments can be managed in the Payments section. You can update payment status and export records.";
    if (text.includes("cancel")) return "To cancel a booking, go to Bookings, select the booking, and update its status to Cancelled.";
    if (text.includes("vehicle") || text.includes("add")) return "To add a vehicle, go to Vehicles > Add Vehicle. Fill in the details and click Save.";
    if (text.includes("customer")) return "You can manage customers in the Customers section. View profiles, verify licenses, and update account status.";
    if (text.includes("hello") || text.includes("hi")) return "Hello! I can help you navigate the Vental admin panel.";
    return "I can help with bookings, vehicles, customers, payments, and navigation. Try asking a specific question.";
}

export default function ChatPage() {
    const [messages, setMessages] = useState([{ sender: "bot", text: "Hi! I am the Vental admin assistant. How can I help you?" }]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const chatEndRef = useRef(null);

    const canSend = useMemo(() => input.trim().length > 0 && !typing, [input, typing]);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

    const sendMessage = (messageText = input) => {
        const cleanText = messageText.trim();
        if (!cleanText || typing) return;
        setMessages((prev) => [...prev, { sender: "user", text: cleanText }]);
        setInput("");
        setTyping(true);
        setTimeout(() => {
            setMessages((prev) => [...prev, { sender: "bot", text: getBotReply(cleanText) }]);
            setTyping(false);
        }, 600);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Chat Support</h1>
                <p className="text-gray-600">Ask about managing bookings, vehicles, customers, and payments.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden" style={{ maxWidth: "700px" }}>
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-gray-900">Admin Assistant</h2>
                        <p className="text-xs text-gray-500">Ask about managing your fleet</p>
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full border border-green-200">Online</span>
                </div>

                <div className="flex flex-wrap gap-2 p-4 border-b border-gray-100">
                    {quickQuestions.map((q) => (
                        <button key={q} type="button" onClick={() => sendMessage(q)} disabled={typing}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 hover:bg-blue-100 disabled:opacity-50">
                            {q}
                        </button>
                    ))}
                </div>

                <div className="h-80 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {typing && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-2xl text-sm">Typing...</div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <form className="p-4 border-t border-gray-200 flex gap-3" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..."
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    <button type="submit" disabled={!canSend}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
