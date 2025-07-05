import React from 'react';

const MessageBubble = ({ message, isSender }) => {
    const bubbleStyles = isSender
        ? 'bg-indigo-600 text-white self-end'
        : 'bg-white text-gray-800 self-start border';

    const timestampStyles = isSender ? 'text-indigo-200' : 'text-gray-400';

    return (
        <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-4 py-2 max-w-md md:max-w-lg shadow-sm ${bubbleStyles}`}>
                <p className="text-sm break-words">{message.text}</p>
                <span className={`block text-xs mt-1 text-right ${timestampStyles}`}>
                    {message.timestamp}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;