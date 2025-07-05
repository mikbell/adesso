import React, { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

const ChatWindow = ({ seller, messages, onSendMessage }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col bg-gray-100 h-full">
            <ChatHeader seller={seller} />
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {messages.map((msg, index) => (
                    <MessageBubble key={msg.id || index} message={msg} isSender={msg.sender === 'admin'} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <MessageInput onSendMessage={onSendMessage} />
        </div>
    );
};

export default ChatWindow;