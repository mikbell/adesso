// src/components/DashboardCard.jsx
import React from 'react';

const DashboardCard = ({ title, value, icon, bgColorClass }) => {
    return (
        <div className="flex justify-between items-center p-5 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-gray-800">{value}</h2>
                <span className="text-sm text-gray-600">{title}</span>
            </div>
            <div className={`w-12 h-12 rounded-full ${bgColorClass} flex justify-center items-center text-2xl text-white shadow-md`}>
                {icon}
            </div>
        </div>
    );
};

export default DashboardCard;