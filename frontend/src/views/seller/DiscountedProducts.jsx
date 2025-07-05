import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Importa i componenti della tabella riutilizzabili
import TableHeader from '../../components/tables/TableHeader';
import StandardTable from '../../components/tables/StandardTable';
import TablePagination from '../../components/tables/TablePagination';

// Importa icone, dati e altri componenti
import { FiEdit, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { discountedProductsData } from '../../data/discountedProductsData';
import ActionsMenu from '../../components/shared/ActionsMenu';

const DiscountedProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(discountedProductsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // La logica per la ricerca e la paginazione è identica a prima
  const filteredData = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleEditDiscount = (product) => {
    navigate(`/admin/dashboard/discounted-products/edit/${product.id}`);
  };

  const handleEndOffer = (product) => {
    setProducts(prev => prev.filter(p => p.id !== product.id));
  }

  // ▼▼▼ DEFINIZIONE DELLE COLONNE SPECIFICHE PER QUESTA VISTA ▼▼▼
  const discountedProductActions = [
    {
      key: 'main-actions',
      items: [
        {
          label: 'Modifica Sconto',
          icon: FiEdit,
          onClick: handleEditDiscount,
        },
      ]
    },
    {
      key: 'destructive-actions',
      items: [
        {
          label: 'Termina Offerta',
          icon: FiTrash2,
          onClick: handleEndOffer,
          isDestructive: true,
        },
      ]
    }
  ];

  const columns = [
    {
      header: 'Prodotto',
      render: (item) => (
        <div className="flex items-center gap-3">
          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
          <span className="font-medium text-gray-900">{item.name}</span>
        </div>
      )
    },
    {
      header: 'Prezzo e Sconto',
      render: (item) => (
        <div>
          <span className="font-bold text-lg text-indigo-600">€{item.discountPrice.toFixed(2)}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 line-through">€{item.originalPrice.toFixed(2)}</span>
            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
              -{item.discountPercentage}%
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Stock',
      render: (item) => (
        <span className={`font-medium ${item.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>
          {item.stock}
        </span>
      )
    },
    { header: 'Categoria', accessor: 'category' },
    {
      header: 'Azioni',
      render: (product) => (
        <div className="flex justify-end">
          <ActionsMenu item={product} actionGroups={discountedProductActions} />
        </div>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <TableHeader
          title="Gestione Prodotti Scontati"
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
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default DiscountedProducts;