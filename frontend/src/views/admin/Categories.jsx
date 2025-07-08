import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';

import { getCategories, clearMessages } from '../../store/reducers/categoryReducer';
import CategoriesTable from "../../components/tables/CategoriesTable";
import CreateCategory from "../../components/shared/CreateCategory";
import Button from "../../components/shared/Button";
import { toast } from 'react-hot-toast';

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, totalCategories, loader, successMessage, errorMessage } = useSelector(state => state.category);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getCategories({ page: currentPage, perPage, search }));
  }, [dispatch, currentPage, perPage, search]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearMessages());
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className='px-4 md:px-7 py-5'>
      <div className="flex flex-wrap -mx-3">
        <div className="w-full px-3 mb-6 lg:mb-0">
          <div className="flex justify-between mb-4">
            <h1 className='text-2xl font-bold mb-4'>Categorie</h1>
            <Button
              onClick={() => setIsSidebarOpen(true)}
              variant="primary"
              icon={FiPlus}
              size="md"
            >
              Aggiungi Nuova Categoria
            </Button>
          </div>
          {/* Passa i dati e il loader alla tabella */}
          <CategoriesTable
            categories={categories}
            totalCategories={totalCategories}
            isLoading={loader}
            // Passa le funzioni per gestire paginazione e ricerca
            onPageChange={setCurrentPage}
            onPerPageChange={setPerPage}
            onSearch={setSearch}
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