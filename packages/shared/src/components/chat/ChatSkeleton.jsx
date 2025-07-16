import React from 'react';

const ChatSkeleton = () => (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 animate-pulse">
        {/* Sidebar Skeleton */}
        <div className="w-1/3 max-w-sm bg-white border-r border-gray-200 p-4 space-y-4">
            <div className="h-10 bg-gray-200 rounded-lg"></div>
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
        {/* Chat Area Skeleton */}
        <div className="flex-1 flex flex-col">
            <div className="p-4 border-b bg-white">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="flex-1 p-6 space-y-6">
                <div className="h-10 bg-gray-200 rounded-lg w-1/2 self-start"></div>
                <div className="h-16 bg-gray-300 rounded-lg w-3/5 self-end ml-auto"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-1/2 self-start"></div>
            </div>
            <div className="p-4 border-t bg-white flex items-center gap-3">
                <div className="h-12 bg-gray-200 rounded-lg flex-1"></div>
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
            </div>
        </div>
    </div>
);

export default ChatSkeleton;