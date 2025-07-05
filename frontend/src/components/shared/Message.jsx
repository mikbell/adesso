import React from 'react'

const Message = ({message}) => {
    return (
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"> 
            <img
                src={message.avatar}
                alt={message.sender}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0" 
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/CCCCCC/666666?text=?" }}
            />
            <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-semibold text-gray-800">{message.sender}</h4>
                    <span className="text-xs text-gray-500">{message.time}</span>
                </div>
                <p className="text-xs text-gray-700 leading-snug line-clamp-2"> 
                    {message.message}
                </p>
            </div>
        </div>
    )
}

export default Message