import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-between items-center pt-4 border-t">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
                <FiChevronLeft />
                Precedente
            </button>
            <span className="text-sm text-gray-600">
                Pagina <span className="font-bold">{currentPage}</span> di <span className="font-bold">{totalPages}</span>
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
                Successiva
                <FiChevronRight />
            </button>
        </div>
    );
};

export default Pagination;