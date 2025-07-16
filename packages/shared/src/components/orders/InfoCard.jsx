import React from 'react';

const InfoCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <div className="flex items-center gap-3 mb-3">
      <span className="text-indigo-600">{icon}</span>
      <h3 className="text-md font-bold text-gray-700">{title}</h3>
    </div>
    <div className="pl-8">{children}</div>
  </div>
);

export default InfoCard;