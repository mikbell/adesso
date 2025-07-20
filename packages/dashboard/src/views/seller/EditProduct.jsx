import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// Componenti, Icone e Azioni Redux
import { CustomButton, CustomListbox, CustomInput } from '@adesso/ui-components';
import { FiUploadCloud, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { getProductById, updateProduct, clearProductMessages, getCategories } from '@adesso/core-logic';


const statuses = [
    { id: 1, value: 'draft', name: 'Bozza' },
    { id: 2, value: 'published', name: 'Pubblicato' },
    { id: 3, value: 'archived', name: 'Archiviato' },
];

const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Stato da Redux
    const { product, loader, successMessage, errorMessage } = useSelector(state => state.product);
    const { categories } = useSelector(state => state.category);

    // Stato locale per gestire il form e le immagini
    const [productData, setProductData] = useState(null);
    const [newImages, setNewImages] = useState([]); // File di nuove immagini
    const [imagesToRemove, setImagesToRemove] = useState([]); // public_id delle immagini da rimuovere

    // 1. Carica dati iniziali (prodotto e categorie)
    useEffect(() => {
        dispatch(getProductById(productId));
        if (categories.length === 0) {
            dispatch(getCategories({ page: 1, perPage: 100, search: '' }));
        }
    }, [productId, dispatch, categories.length]);

    // 2. Popola il form quando i dati del prodotto arrivano da Redux
    useEffect(() => {
        if (product) {
            setProductData({
                ...product,
                category: categories.find(c => c.name === product.category) || null,
                status: statuses.find(s => s.value === product.status.toLowerCase()) || null,
            });
        }
    }, [product, categories]);

    // 3. Gestisce i messaggi di successo/errore
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearProductMessages());
            navigate(`/seller/dashboard/products`);
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(clearProductMessages());
        }
    }, [successMessage, errorMessage, dispatch, navigate]);


    // Handler per i campi di testo
    const handleChange = (e) => {
        setProductData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleSelectChange = (field, value) => {
        setProductData(prev => ({ ...prev, [field]: value }));
    };

    // Handler per le immagini
    const handleImageChange = (e) => {
        setNewImages(prev => [...prev, ...Array.from(e.target.files)]);
    };

    const handleRemoveImage = (img, index, isNew) => {
        if (isNew) {
            setNewImages(prev => prev.filter((_, i) => i !== index));
        } else {
            // Aggiungi l'ID pubblico alla lista di rimozione e nascondi l'immagine
            setImagesToRemove(prev => [...prev, img.public_id]);
            setProductData(prev => ({
                ...prev,
                images: prev.images.filter(i => i.public_id !== img.public_id)
            }));
        }
    };

    // Handler per l'invio del form
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Aggiungi tutti i campi di testo
        Object.keys(productData).forEach(key => {
            if (key !== 'images' && key !== 'category' && key !== 'status') {
                formData.append(key, productData[key]);
            }
        });

        // Aggiungi i valori corretti per categoria e stato
        formData.append('category', productData.category.name);
        formData.append('status', productData.status.value);

        // Aggiungi le immagini esistenti, le nuove e quelle da rimuovere
        formData.append('existingImages', JSON.stringify(productData.images));
        formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
        newImages.forEach(img => {
            formData.append('newImages', img);
        });

        dispatch(updateProduct({ productId, formData }));
    };

    const handleCancel = () => {
        navigate(-1);
    };

    // Aggiungi questo per controllare i dati che arrivano da Redux
    useEffect(() => {
        console.log("Dati del prodotto in EditProduct:", product);
    }, [product]);


    if (loader && !productData) {
        return <LoadingPage />;
    }
    if (!productData) {
        return <div className="p-6 text-center">Prodotto non trovato.</div>;
    }
    return (
        <div className="p-4 md:p-6">
            <header className="mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-2">
                    <FiArrowLeft /><span>Annulla e torna indietro</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Modifica: {productData.name}</h1>
            </header>

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
                                <CustomInput as='textarea' label="Descrizione" name="description" value={productData.description} onChange={handleChange} />
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
                            {/* Preview delle immagini */}
                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                {/* ▼▼▼ INIZIO MODIFICA ▼▼▼ */}

                                {/* Immagini esistenti (con controllo di sicurezza) */}
                                {productData.images && productData.images.map((img, index) => (
                                    <div key={img.public_id || index} className="relative group">
                                        <img src={img.url} alt={`Anteprima ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                                        <button type="button" onClick={() => handleRemoveImage(img, index, false)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transition-opacity group-hover:opacity-100 opacity-0">
                                            <FiTrash2 size={12} />
                                        </button>
                                    </div>
                                ))}

                                {/* ▲▲▲ FINE MODIFICA ▲▲▲ */}

                                {/* Nuove immagini (già corretto) */}
                                {newImages.map((imgFile, index) => (
                                    <div key={index} className="relative group">
                                        <img src={URL.createObjectURL(imgFile)} alt={`Nuova anteprima ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                                        <button type="button" onClick={() => handleRemoveImage(imgFile, index, true)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transition-opacity group-hover:opacity-100 opacity-0">
                                            <FiTrash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
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
                                <CustomInput type="text" name="sku" label="SKU (Codice Prodotto)" value={productData.sku} onChange={handleChange} placeholder="SKU" />
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
                    <CustomButton type="button" variant="secondary" onClick={handleCancel}>Annulla</CustomButton>
                    {/* Usa il 'loader' da Redux per lo stato di caricamento */}
                    <CustomButton type="submit" variant="primary" loading={loader} disabled={loader}>
                        {loader ? 'Salvataggio...' : 'Salva Prodotto'}
                    </CustomButton>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;