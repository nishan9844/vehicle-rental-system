import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import '../css/chat.css';
import { getChatbotReply, getInitialChatbotMessage } from '../services/chatbotService';

export const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: getInitialChatbotMessage(), sender: "bot" },
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        const cleanInput = inputValue.trim();

        if (!cleanInput) return;

        setMessages((current) => [
            ...current,
            { id: Date.now(), text: cleanInput, sender: "user" },
            { id: Date.now() + 1, text: getChatbotReply(cleanInput), sender: "bot" },
        ]);
        setInputValue('');
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="chat-avatar">V</div>
                <h2 className="chat-title">Vental Chatter</h2>
            </div>
            <div className="chat-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.sender === 'bot' ? 'received' : 'sent'}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type message here..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="chat-send-btn" onClick={handleSend}>
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};
