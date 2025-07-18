import React from 'react';
import StatusBadge from '../shared/StatusBadge';

const OrderTimeline = ({ history }) => (
    <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-5">Cronologia Ordine</h3>
        <ol className="relative border-l border-gray-200 ml-3">
            {history.map((item, index) => (
                <li key={index} className="mb-8 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full -left-3 ring-8 ring-white">
                        <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                    </span>
                    <div className="flex items-center mb-1">
                        <h4 className="font-semibold text-gray-900 mr-3">{item.status}</h4>
                        <time className="text-sm font-normal leading-none text-gray-400">
                            {new Date(item.date).toLocaleDateString('it-IT')}
                        </time>
                    </div>
                    <p className="text-sm text-gray-600">{item.comment}</p>
                </li>
            ))}
        </ol>
    </div>
);

export default OrderTimeline;