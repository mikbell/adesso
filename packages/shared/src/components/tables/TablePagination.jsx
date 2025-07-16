import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import CustomListbox from '../shared/CustomListbox';

const itemsPerPageOptions = [{
    id: 1,
    value: 10,
    name: '10',
}, {
    id: 2,
    value: 25,
    name: '25',
}, {
    id: 3,
    value: 50,
    name: '50',
},];

const TablePagination = ({ currentPage, totalPages, itemsPerPage, onPageChange, onItemsPerPageChange }) => {
    const ellipsis = '...';

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) {
                    pageNumbers.push(ellipsis);
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pageNumbers.push(ellipsis);
                }
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    // ▼▼▼ MODIFICA 2: Trova l'oggetto completo da passare come 'value' al Listbox ▼▼▼
    const selectedItemsPerPageOption = itemsPerPageOptions.find(
        (option) => option.value === itemsPerPage
    );

    // ▼▼▼ MODIFICA 3: Crea una funzione "adattatore" per l'onChange ▼▼▼
    const handleListboxChange = (selectedOption) => {
        // Simula l'oggetto evento che la funzione originale si aspetta
        const mockEvent = {
            target: {
                value: selectedOption.value,
            },
        };
        onItemsPerPageChange(mockEvent);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-3 bg-gray-50 rounded-lg">
            {itemsPerPage !== undefined && onItemsPerPageChange !== undefined && (
                <div className="flex items-center gap-2 mb-4 sm:mb-0">
                    <span className="text-sm text-gray-700">Elementi per pagina:</span>
                    <CustomListbox
                        options={itemsPerPageOptions}
                        value={selectedItemsPerPageOption} // Passa l'oggetto trovato
                        onChange={handleListboxChange}   // Passa la nuova funzione adattatore
                    />
                </div>
            )}

            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="sr-only">Precedente</span>
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>

                {pageNumbers.map((page, index) => (
                    page === ellipsis ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                            {ellipsis}
                        </span>
                    ) : (
                        <button
                            key={`page-${index}`}
                            onClick={() => onPageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium
                                ${page === currentPage ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="sr-only">Successiva</span>
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
            </nav>
        </div>
    );
};

export default TablePagination;
