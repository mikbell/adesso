import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';

import { fetchProductById } from '../../data/productsData';
import Button from '../../components/shared/Button';
import StatusBadge from '../../components/shared/StatusBadge';
import ProductImageGallery from '../../components/products/ProductImageGallery';

const ViewProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(productId);
        setProduct(data);
      } catch (error) {
        setProduct(null);
        console.error('Errore nel caricamento del prodotto:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  const handleDelete = () => {
    if (window.confirm(`Sei sicuro di voler eliminare "${product.name}"?`)) {
      // Logica di eliminazione...
      alert('Prodotto eliminato!');
      navigate('/seller/dashboard/products');
    }
  };

  if (loading) return <div className="p-6 text-center">Caricamento prodotto...</div>;
  if (!product) return <div className="p-6 text-center text-red-500">Prodotto non trovato.</div>;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <Link to="/seller/dashboard/products" className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-2">
            <FiArrowLeft /><span>Torna ai prodotti</span>
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <StatusBadge status={product.status} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="danger" icon={FiTrash2} onClick={handleDelete}>Elimina</Button>
          <Button variant="primary" icon={FiEdit} onClick={() => navigate(`/seller/dashboard/products/${productId}/edit`)}>Modifica Prodotto</Button>
        </div>
      </header>

      {/* Layout a griglia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonna Sinistra */}
        <div className="lg:col-span-2 space-y-6">
          <ProductImageGallery images={product.images} altText={product.name} />
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Descrizione Completa</h2>
            <p className="text-gray-600 leading-relaxed">{product.fullDescription}</p>
          </div>
        </div>
        {/* Colonna Destra */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Informazioni Chiave</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500">Prezzo</span>
                <span className="font-bold text-gray-800">€{product.price}</span>
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
          {/* Puoi aggiungere qui altri componenti, come la timeline delle attività */}
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;