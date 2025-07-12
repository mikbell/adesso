import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

import { getCategories, deleteCategory, clearMessages } from '../../store/reducers/categorySlice';
import CategoriesTable from "../../components/tables/CategoriesTable";
import CreateCategory from "../../components/shared/CreateCategory";
import CustomButton from "../../components/shared/CustomButton";

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, totalCategories, loader, successMessage, errorMessage } = useSelector(state => state.category);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Effetto per caricare le categorie quando la pagina, il numero di elementi o la ricerca cambiano.
  useEffect(() => {
    const params = { page: currentPage, perPage, search };
    dispatch(getCategories(params));
  }, [dispatch, currentPage, perPage, search]);

  // Effetto per mostrare i messaggi di successo o errore.
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
      // Se c'è un messaggio di successo (es. dopo l'eliminazione), ricarica i dati.
      if (successMessage.includes('eliminata')) {
        dispatch(getCategories({ page: currentPage, perPage, search }));
      }
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearMessages());
    }
  }, [successMessage, errorMessage, dispatch, currentPage, perPage, search]);

  // Funzione per gestire l'eliminazione di una categoria.
  const handleDelete = (categoryId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa categoria?')) {
      dispatch(deleteCategory(categoryId));
    }
  };

  return (
    <div className='px-4 md:px-7 py-5'>
      <div className="flex flex-wrap -mx-3">
        <div className="w-full px-3 mb-6 lg:mb-0">
          <div className="flex justify-between items-center mb-4">
            <h1 className='text-2xl font-bold'>Categorie</h1>
            <CustomButton
              onClick={() => setIsSidebarOpen(true)}
              variant="primary"
              icon={FiPlus}
              size="md"
            >
              Aggiungi Categoria
            </CustomButton>
          </div>

          {/* Il componente tabella ora riceve tutto via props */}
          <CategoriesTable
            categories={categories}
            totalCategories={totalCategories}
            isLoading={loader}
            onDelete={handleDelete}
            onEdit={(id) => console.log("Edit category:", id)} // Aggiungi la tua logica di modifica
            // Props per la paginazione e la ricerca
            currentPage={currentPage}
            perPage={perPage}
            search={search}
            onPageChange={setCurrentPage}
            onPerPageChange={setPerPage}
            onSearchChange={setSearch}
            showSearch
            showItemsPerPage
          />
        </div>
      </div>

      <CreateCategory
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default Categories;
