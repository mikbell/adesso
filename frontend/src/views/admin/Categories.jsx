import React, { useState } from 'react';
import CategoriesTable from "../../components/CategoriesTable";
import CreateCategory from "../../components/CreateCategory";
import Button from "../../components/Button";
import { FiPlus } from 'react-icons/fi';

const Categories = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCategoryCreationSuccess = () => {
    console.log("Categoria creata con successo! Aggiorno la lista...");
  };

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
          <CategoriesTable showSearch showItemsPerPage />
        </div>
      </div>

      <CreateCategory
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSubmitSuccess={handleCategoryCreationSuccess}
      />
    </div>
  );
};

export default Categories;