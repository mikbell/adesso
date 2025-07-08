import React, { useMemo, useState } from 'react'
import TableHeader from './TableHeader';
import TablePagination from './TablePagination';
import CategoriesTableRow from './CategoriesTableRow';
import { categories } from '../../data/categoriesData';

const CategoriesTable = ({ showSearch, showItemsPerPage, showButton }) => {
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Changed from ordersPerPage
    // State for search term
    const [searchTerm, setSearchTerm] = useState('');

    // Dummy data for categories
    const allCategories = useMemo(() => categories, []);

    // Filter categories based on search term
    const filteredCategories = useMemo(() => {
        if (!searchTerm) {
            return allCategories;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return allCategories.filter(category =>
            category.id.toLowerCase().includes(lowercasedSearchTerm) ||
            category.name.toLowerCase().includes(lowercasedSearchTerm) ||
            category.status.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [allCategories, searchTerm]);

    // Calculate categories to display on the current page
    const currentCategories = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredCategories, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleEditCategory = (categoryId) => {
        console.log('Modifica categoria:', categoryId);
    };

    const handleDeleteCategory = (categoryId) => {
        console.log('Elimina categoria:', categoryId);
        if (window.confirm(`Sei sicuro di voler eliminare la categoria ${categoryId}?`)) {
            // Logic to remove category from state/backend
        }
    };


    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-md">

            <TableHeader
                showSearch={showSearch}
                showItemsPerPage={showItemsPerPage}
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                showButton={showButton}
            />
            {filteredCategories.length === 0 && searchTerm ? (
                <p className="text-gray-500 text-center py-8">Nessuna categoria trovata per "{searchTerm}".</p>
            ) : filteredCategories.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nessuna categoria disponibile.</p>
            ) : (
                <>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Categoria</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immagine</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Categoria</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prodotti</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Azioni</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentCategories.map((category) => (
                                <CategoriesTableRow
                                    key={category.id}
                                    category={category}
                                    onEdit={handleEditCategory}
                                    onDelete={handleDeleteCategory}
                                />
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <TablePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage} // Changed from ordersPerPage
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange} // Changed from onOrdersPerPageChange
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default CategoriesTable