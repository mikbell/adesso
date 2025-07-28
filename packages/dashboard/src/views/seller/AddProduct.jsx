import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiUploadCloud, FiTrash2 } from 'react-icons/fi';
import { CustomButton, CustomListbox, CustomInput } from '@adesso/ui-components';
import { toast } from 'react-hot-toast';

// Importa le azioni/thunks da entrambi gli slice
import { addProduct, clearProductMessages, getCategories } from '@adesso/core-logic';

const statuses = [
  { id: 1, value: 'published', name: 'Pubblicato' },
  { id: 2, value: 'draft', name: 'Bozza' },
  { id: 3, value: 'archived', name: 'Archiviato' },
];

const AddProduct = () => {
  // 1. Hook per interagire con Redux
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage } = useSelector(state => state.product);
  const { categories } = useSelector(state => state.category);

  // Stato locale per i dati del form e le anteprime delle immagini
  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    discount: '',
    stock: '',
    category: null, // Inizializzato a null, verrà popolato dalle categorie caricate
    status: statuses.find(s => s.value === 'draft'),
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // 2. Carica le categorie quando il componente viene montato
  useEffect(() => {
    // Chiamiamo getCategories per popolare la dropdown.
    // Assumiamo di volere tutte le categorie, quindi usiamo un perPage alto.
    dispatch(getCategories({ page: 1, perPage: 100, search: '' }));
  }, [dispatch]);

  // Imposta la categoria di default una volta che le categorie sono state caricate
  useEffect(() => {
    if (categories.length > 0 && !productData.category) {
      setProductData(prev => ({ ...prev, category: categories[0] }));
    }
  }, [categories, productData.category]);

  // 3. Gestisce i messaggi di successo ed errore provenienti da Redux
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearProductMessages()); // Pulisce il messaggio per evitare che riappaia
      // Resetta il form
      setProductData({
        name: '',
        brand: '',
        description: '',
        price: '',
        discount: '',
        stock: '',
        category: categories.length > 0 ? categories[0] : null,
        status: statuses.find(s => s.value === 'draft'),
      });
      setImages([]);
      setImagePreviews([]);
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearProductMessages());
    }
  }, [successMessage, errorMessage, dispatch, categories]);

  // Gestori di eventi (in gran parte invariati)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectChange = (field, value) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  // 4. Funzione di invio aggiornata per usare Redux
  const handleSubmit = (e) => {
    e.preventDefault();

    // Crea un oggetto FormData per inviare i dati, incluse le immagini
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('brand', productData.brand);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('discount', productData.discount);
    formData.append('stock', productData.stock);
    formData.append('category', productData.category.name);
    formData.append('status', productData.status.value);

    // Aggiunge tutte le immagini al FormData
    images.forEach(image => {
      formData.append('images', image);
    });

    // Invia l'azione per aggiungere il prodotto
    dispatch(addProduct(formData));
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Aggiungi Nuovo Prodotto</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonna Sinistra (più grande) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Informazioni Prodotto */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Informazioni Prodotto</h2>
              <div className="space-y-4">
                <CustomInput label="Nome Prodotto" name="name" value={productData.name} onChange={handleChange} required />
                <CustomInput label="Marca" name="brand" value={productData.brand} onChange={handleChange} required />
                <CustomInput as="textarea" label="Descrizione" name="description" value={productData.description} onChange={handleChange} />
              </div>
            </div>

            {/* Card Immagini Prodotto */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Immagini</h2>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <span>Carica un file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageChange} accept="image/*" />
                    </label>
                    <p className="pl-1">o trascina qui</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF fino a 10MB</p>
                </div>
              </div>
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img src={preview} alt={`Anteprima ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                      <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Colonna Destra (Sidebar) */}
          <div className="space-y-6">
            {/* Card Prezzi e Stock */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Prezzi e Inventario</h2>
              <div className="space-y-4">
                <CustomInput type="number" name="price" label="Prezzo" value={productData.price} onChange={handleChange} required placeholder="0.00" step="0.01" />
                <CustomInput type="number" name="discount" label="% Sconto" value={productData.discount} onChange={handleChange} placeholder="0" step="1" min="0" max="100" />
                <CustomInput type="number" name="stock" label="Stock" value={productData.stock} onChange={handleChange} required placeholder="0" />
              </div>
            </div>

            {/* Card Organizzazione */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Organizzazione</h2>
              <div className="space-y-4">
                <CustomListbox
                  label="Categoria"
                  options={categories}
                  value={productData.category}
                  onChange={(value) => handleSelectChange('category', value)}
                />
                <CustomListbox
                  label="Stato"
                  options={statuses}
                  value={productData.status}
                  onChange={(value) => handleSelectChange('status', value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pulsanti di Azione */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <CustomButton type="button" variant="secondary">Annulla</CustomButton>
          {/* Usa il 'loader' da Redux per lo stato di caricamento */}
          <CustomButton type="submit" variant="primary" loading={loader} disabled={loader}>
            {loader ? 'Salvataggio...' : 'Salva Prodotto'}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;