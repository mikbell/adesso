import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const MessageInput = ({ onSendMessage }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(text.trim());
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex items-center gap-3">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Scrivi un messaggio..."
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                autoComplete="off"
            />
            <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                disabled={!text.trim()}
                aria-label="Invia messaggio"
            >
                <FiSend size={20} />
            </button>
        </form>
    );
};

export default MessageInput;