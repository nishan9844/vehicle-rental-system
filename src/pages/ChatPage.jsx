import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChatInterface } from '../components/ChatPageComponents';

const ChatPage = () => {
    return (
        <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main className="main-content" style={{ flex: 1, backgroundColor: '#f1f5f9', padding: '20px' }}>
                <ChatInterface />
            </main>
            <Footer />
        </div>
    );
};

export default ChatPage;
