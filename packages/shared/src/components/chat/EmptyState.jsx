import React from 'react';

const EmptyState = ({ icon, title, message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
        <div className="mb-4 text-gray-400">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
        <p className="mt-1 text-sm">{message}</p>
    </div>
);

export default EmptyState;