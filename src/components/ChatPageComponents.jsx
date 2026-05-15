import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import '../css/chat.css';

export const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am Vental Chatter. How can I help you today?", sender: "bot" },
        { id: 2, text: "I'm looking for a 4-wheeler to rent this weekend.", sender: "user" },
        { id: 3, text: "Great! We have several options available. Do you have a specific brand in mind?", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (inputValue.trim()) {
            setMessages([...messages, { id: Date.now(), text: inputValue, sender: "user" }]);
            setInputValue('');
        }
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="chat-send-btn" onClick={handleSend}>
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};
