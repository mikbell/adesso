import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// Componenti, Icone e Azioni Redux
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import CustomButton from '../../components/shared/CustomButton';
import StatusBadge from '../../components/shared/StatusBadge';
import ProductImageGallery from '../../components/products/ProductImageGallery';
import LoadingPage from '../../components/shared/LoadingPage';
import { getProductById, deleteProduct, clearMessages, clearProductState } from '../../store/reducers/productSlice';
import SmartPrice from '../../components/shared/SmartPrice';

const ViewProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Connessione allo stato di Redux
  const { product, loader, successMessage, errorMessage } = useSelector(state => state.product);

  // 2. Recupero dei dati e pulizia
  useEffect(() => {
    dispatch(getProductById(productId));

    // Funzione di pulizia: viene eseguita quando il componente viene smontato
    return () => {
      dispatch(clearProductState());
    };
  }, [dispatch, productId]);

  // 3. Gestione dei messaggi di successo/errore
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
      if (successMessage.includes('eliminato')) {
        navigate('/seller/dashboard/products');
      }
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearMessages());
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  // 4. Gestione dell'eliminazione
  const handleDelete = () => {
    if (window.confirm(`Sei sicuro di voler eliminare "${product.name}"?`)) {
      dispatch(deleteProduct(productId));
    }
  };

  if (loader || !product) {
    return <LoadingPage />;
  }

  // Calcolo del prezzo scontato per la visualizzazione
  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount ? product.price - (product.price * product.discount / 100) : product.price;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <CustomButton to="/seller/dashboard/products" variant="link">
            <FiArrowLeft /><span>Torna ai prodotti</span>
          </CustomButton>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <StatusBadge status={product.status} />
          </div>
        </div>
        <div className="flex gap-2">
          <CustomButton variant="danger" icon={FiTrash2} onClick={handleDelete} loading={loader}>Elimina</CustomButton>
          <CustomButton variant="primary" icon={FiEdit} onClick={() => navigate(`/seller/dashboard/products/${product._id}/edit`)}>Modifica</CustomButton>
        </div>
      </header>

      {/* Layout a griglia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonna Sinistra */}
        <div className="lg:col-span-2 space-y-6">
          <ProductImageGallery images={product.images || []} altText={product.name} />
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Descrizione Completa</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        </div>
        {/* Colonna Destra */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Informazioni Chiave</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500">Nome</span>
                <span className="font-bold text-gray-800">{product.name}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Marca</span>
                <span className="font-bold text-gray-800">{product.brand}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Stato</span>
                <StatusBadge status={product.status} />
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">ID</span>
                <span className="font-bold text-gray-800">{product._id}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-500">Prezzo</span>
                <SmartPrice hasDiscount={hasDiscount} discountedPrice={discountedPrice} product={product} />
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Stock</span>
                <span className={`font-bold ${product.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>{product.stock} unità</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">SKU</span>
                <span className="font-mono text-gray-800">{product.sku}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Categoria</span>
                <span className="font-medium text-indigo-600">{product.category}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;