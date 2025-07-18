import React from 'react';

// Un componente "scheletro" per mostrare durante il caricamento
const TableSkeleton = ({ columns }) => (
    <div className="animate-pulse">
        <div className="bg-gray-200 h-12 rounded-t-lg"></div>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center p-4 border-b border-gray-200">
                {columns.map((_c, j) => (
                    <div key={j} className="flex-1 px-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                ))}
            </div>
        ))}
    </div>
);

const StandardTable = ({ data, columns, loader }) => {
    // 1. Se sta caricando e non ci sono ancora dati, mostra lo scheletro
    if (loader && (!data || data.length === 0)) {
        return <TableSkeleton columns={columns} />;
    }

    // 2. Se il caricamento è finito e non ci sono dati, mostra un messaggio chiaro
    if (!data || data.length === 0) {
        return <p className="text-gray-500 text-center py-10">Nessun elemento da visualizzare.</p>;
    }

    return (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={col.header || index} scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item) => (
                        <tr key={item._id || item.id} className="hover:bg-gray-50 transition-colors">
                            {columns.map((col) => (
                                <td key={`${item._id || item.id}-${col.header}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {/* 3. La logica di rendering è definita nelle colonne */}
                                    {col.render ? col.render(item) : (col.accessor ? item[col.accessor] : null)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StandardTable;