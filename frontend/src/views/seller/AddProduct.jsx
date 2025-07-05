import React, { useState } from 'react';
import { FiUploadCloud, FiTrash2, FiBox, FiCheck, FiChevronDown } from 'react-icons/fi';
import Button from '../../components/shared/Button';
import CustomListbox from '../../components/shared/CustomListbox';
import { categories } from '../../data/categoriesData'
import CustomInput from '../../components/shared/CustomInput';
import TextArea from '../../components/shared/TextArea';

const statuses = [
  {
    id: 1,
    value: 'draft',
    name: 'Bozza',
  },
  {
    id: 2,
    value: 'published',
    name: 'Pubblicato',
  },
  {
    id: 3,
    value: 'archived',
    name: 'Archiviato',
  }];

const AddProduct = () => {


  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    sku: '',
    stock: '',
    category: categories[0], // Inizializza con il primo oggetto categoria
    status: statuses.find(s => s.value === 'draft'), // Trova l'oggetto status di default
    images: [],
  });

  // Stato separato per le URL di anteprima delle immagini
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Gestore generico per gli input di testo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  // Gestore per il caricamento delle immagini
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData(prev => ({ ...prev, images: [...prev.images, ...files] }));

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // Gestore per la rimozione di un'immagine dall'anteprima
  const handleRemoveImage = (index) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectChange = (field, value) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  // Gestore per l'invio del form
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Qui andrebbe la logica per inviare i dati a un'API
    // Per ora, simuliamo un caricamento e stampiamo i dati in console
    console.log("Dati del prodotto da inviare:", productData);

    setTimeout(() => {
      setLoading(false);
      alert('Prodotto salvato con successo! (Simulazione)');
      // Potresti resettare il form o reindirizzare l'utente qui
    }, 1500);
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
                <CustomInput label="Nome Prodotto" name="name" value={productData.name} onChange={handleChange} />
                <TextArea label="Descrizione" name="description" value={productData.description} onChange={handleChange} />
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
                <CustomInput type="number" name="price" id="price" label="Prezzo" value={productData.price} onChange={handleChange} required placeholder="0.00" step="0.01" />
                <CustomInput type="number" name="discount" id="discount" label="% Sconto" value={productData.discount} onChange={handleChange} required placeholder="0" step="1" min="0" max="100" />
                <CustomInput type="number" name="stock" id="stock" label="Stock" value={productData.stock} onChange={handleChange} required placeholder="0" />
                <CustomInput type="text" name="sku" id="sku" label="SKU (Codice Prodotto)" value={productData.sku} onChange={handleChange} required placeholder="SKU" />
              </div>
            </div>

            {/* Card Organizzazione */}

            {/* Listbox per Categoria*/}
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
          <Button type="button" variant="secondary">
            Annulla
          </Button>
          <Button type="submit" variant="primary" loading={loading} disabled={loading}>
            {loading ? 'Salvataggio...' : 'Salva Prodotto'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;