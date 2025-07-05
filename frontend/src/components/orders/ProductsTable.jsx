import React from 'react';

const ProductsTable = ({ products, total }) => (
    <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Prodotti</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 py-3">Prodotto</th>
                        <th scope="col" className="px-4 py-3 text-center">Quantità</th>
                        <th scope="col" className="px-4 py-3 text-right">Prezzo</th>
                        <th scope="col" className="px-4 py-3 text-right">Subtotale</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id} className="bg-white border-b">
                            <td className="px-4 py-4 font-medium text-gray-900 flex items-center gap-3">
                                <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                                {p.name}
                            </td>
                            <td className="px-4 py-4 text-center">{p.quantity}</td>
                            <td className="px-4 py-4 text-right">€{p.price}</td>
                            <td className="px-4 py-4 text-right font-semibold">€{(p.quantity * parseFloat(p.price)).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-semibold text-gray-900">
                        <td colSpan="3" className="px-4 py-3 text-right text-base">Totale Ordine</td>
                        <td className="px-4 py-3 text-right text-base">€{total}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
);

export default ProductsTable;