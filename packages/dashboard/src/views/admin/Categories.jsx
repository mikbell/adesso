import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// -> Importa i thunk e le azioni da core-logic
import { getCategories, deleteCategory, clearCategoryMessages } from '@adesso/core-logic';
// -> Importa i componenti UI riutilizzabili da ui-components
import {
  StandardTable,
  CustomButton,
  TableHeader,
  TablePagination,
  ActionsMenu,
  LoadingPage
} from "@adesso/ui-components";

// Il componente CreateCategory rimane un componente specifico di questa feature
import CreateCategory from '../../components/categories/CreateCategory';


const Categories = () => {
  const dispatch = useDispatch();
  const { categories, totalCategories, loader, successMessage, errorMessage } = useSelector(state => state.category);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Carica le categorie e si aggiorna dopo un'azione di successo
  useEffect(() => {
    dispatch(getCategories({ page: currentPage, perPage, search }));
  }, [dispatch, currentPage, perPage, search, successMessage]);

  // Gestisce le notifiche (toast)
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearCategoryMessages());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearCategoryMessages());
    }
  }, [successMessage, errorMessage, dispatch]);

  // --- Definizione delle Colonne per StandardTable ---
  const columns = useMemo(() => {
    const handleDelete = (categoryId) => {
      if (window.confirm('Sei sicuro di voler eliminare questa categoria?')) {
        dispatch(deleteCategory(categoryId));
      }
    };

    const handleEdit = (categoryId) => {
      console.log("Modifica categoria:", categoryId);
      // Qui in futuro aprirai un modale o una pagina per la modifica
    };

    return [
      {
        header: 'Icona',
        render: (cat) => <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded-md" />
      },
      { header: 'Nome', accessor: 'name' },
      { header: 'Slug', accessor: 'slug' },
      {
        header: 'Azioni',
        render: (cat) => (
          <ActionsMenu
            item={cat}
            actionGroups={[
              { key: 'main', items: [{ label: 'Modifica', icon: FiEdit, onClick: () => handleEdit(cat._id) }] },
              { key: 'destructive', items: [{ label: 'Elimina', icon: FiTrash2, onClick: () => handleDelete(cat._id), isDestructive: true }] }
            ]}
          />
        )
      }
    ];
  }, [dispatch]);


  if (loader && categories.length === 0) {
    return <LoadingPage />;
  }

  return (
    <div className='p-4 md:p-6'>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <TableHeader
          title="Categorie"
          showSearch={true}
          searchTerm={search}
          handleSearchChange={(e) => setSearch(e.target.value)}
        >
          <CustomButton
            onClick={() => setIsSidebarOpen(true)}
            icon={FiPlus}
          >
            Aggiungi Categoria
          </CustomButton>
        </TableHeader>

        <StandardTable
          data={categories}
          columns={columns}
          loader={loader}
        />

        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCategories / perPage)}
          itemsPerPage={perPage}
          totalItems={totalCategories}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setPerPage(value);
            setCurrentPage(1);
          }}
        />
      </div>

      <CreateCategory
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default Categories;