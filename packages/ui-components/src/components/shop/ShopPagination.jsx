import React from 'react'

const Pagination = ({ currentPage, totalPages, getPaginationRange, goToPage, goToNextPage, goToPrevPage, loader }) => {
    return (
        <div className="flex justify-center items-center gap-2 sm:gap-4 mt-10 flex-wrap">
            <button
                onClick={goToPrevPage}
                disabled={currentPage === 1 || loader}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
            >
                Precedente
            </button>

            {/* Pagination Numbers */}
            <div className="flex gap-1 sm:gap-2">
                {getPaginationRange.map((pageNumber, index) => (
                    pageNumber === '...' ? (
                        <span key={index} className="px-3 py-1 text-gray-700 text-sm font-medium">...</span>
                    ) : (
                        <button
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === pageNumber
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                } transition-colors`}
                        >
                            {pageNumber}
                        </button>
                    )
                ))}
            </div>

            <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages || loader}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
            >
                Successiva
            </button>
        </div>
    )
}

export default Pagination