import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import TableHeader from '../../components/tables/TableHeader';
import StandardTable from '../../components/tables/StandardTable';
import TablePagination from '../../components/tables/TablePagination';

import { FiEye, FiEdit, FiTrash2, FiMoreVertical } from 'react-icons/fi';

import { productsData } from '../../data/productsData';
import ActionsMenu from '../../components/shared/ActionsMenu';

const Products = () => {
    const navigate = useNavigate();

    const productActions = [
        {
            key: 'standard-actions',
            items: [
                {
                    label: 'Visualizza',
                    icon: FiEye,
                    onClick: (product) => navigate(`/admin/dashboard/products/${product.id}`),
                },
                {
                    label: 'Modifica',
                    icon: FiEdit,
                    onClick: (product) => navigate(`/admin/dashboard/products/edit/${product.id}`),
                },
            ]
        },
        {
            key: 'destructive-actions',
            items: [
                {
                    label: 'Elimina',
                    icon: FiTrash2,
                    onClick: (product) => {
                        if (window.confirm('Sei sicuro?')) {
                            setAllProducts(prev => prev.filter(p => p.id !== product.id));
                        }
                    },
                    isDestructive: true
                },
            ]
        }
    ];

    const [allProducts, setAllProducts] = useState(productsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredData = useMemo(() => {
        if (!searchTerm) return allProducts;
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return allProducts.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(lowercasedSearchTerm)
            )
        );
    }, [allProducts, searchTerm]);

    const paginatedData = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredData.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const columns = [
        {
            header: 'Prodotto', render: (item) => (
                <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                    <span className="font-medium text-gray-900">{item.name}</span>
                </div>
            )
        },
        { header: 'SKU', accessor: 'sku' },
        { header: 'Categoria', accessor: 'category' },
        { header: 'Prezzo', render: (item) => `€${item.price}` },
        { header: 'Stock', accessor: 'stock' },
        { header: 'Stato', accessor: 'status' },
        {
            header: 'Azioni',
            render: (product) => (
                <div className="flex justify-end">
                    <ActionsMenu item={product} actionGroups={productActions} />
                </div>
            )

        }
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="w-full p-4 bg-white rounded-lg shadow-md">
                <TableHeader
                    title="Tutti i Prodotti"
                    showSearch={true}
                    searchTerm={searchTerm}
                    handleSearchChange={(e) => setSearchTerm(e.target.value)}
                />
                <StandardTable
                    columns={columns}
                    data={paginatedData}
                />
                {totalPages > 1 && (
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Products;