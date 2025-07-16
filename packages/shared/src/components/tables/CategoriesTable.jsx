import TableHeader from './TableHeader';
import TablePagination from './TablePagination';
import CategoriesTableRow from './CategoriesTableRow';

// Il componente ora riceve tutti i dati e le funzioni come props.
const CategoriesTable = ({
    categories,
    totalCategories,
    isLoading,
    onDelete,
    onEdit,
    showSearch,
    showItemsPerPage,
    currentPage,
    perPage,
    search,
    onPageChange,
    onPerPageChange,
    onSearchChange
}) => {

    // La logica di paginazione ora usa i dati e le funzioni passate dal genitore.
    const totalPages = Math.ceil(totalCategories / perPage);

    // Gestione degli stati di caricamento ed errore
    if (isLoading && categories.length === 0) {
        return <div className="p-4 text-center">Caricamento delle categorie...</div>;
    }

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-md">
            <TableHeader
                showSearch={showSearch}
                showItemsPerPage={showItemsPerPage}
                searchTerm={search}
                handleSearchChange={(e) => onSearchChange(e.target.value)}
                itemsPerPage={perPage}
                onItemsPerPageChange={(e) => onPerPageChange(Number(e.target.value))}
            />
            {categories.length === 0 && !isLoading ? (
                <p className="text-gray-500 text-center py-8">
                    {search ? `Nessuna categoria trovata per "${search}".` : "Nessuna categoria disponibile."}
                </p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icona</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.map((category, index) => (
                                    <CategoriesTableRow
                                        key={category._id}
                                        category={category}
                                        index={(currentPage - 1) * perPage + index + 1}
                                        onEdit={() => onEdit(category._id)}
                                        onDelete={() => onDelete(category._id)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <TablePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default CategoriesTable;
