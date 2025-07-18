import React, { useState, useEffect } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// -> Importazioni pulite dai pacchetti del monorepo
import { CustomButton, CustomInput } from '@adesso/ui-components';
import { addCategory, clearCategoryMessages } from '@adesso/core-logic';

const CreateCategory = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();

    // 1. Legge lo stato di caricamento e i messaggi direttamente da Redux
    const { loader, successMessage, errorMessage } = useSelector(state => state.category);

    // 2. Mantiene solo lo stato per i dati del form
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [validationError, setValidationError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB
                toast.error("L'immagine non deve superare i 2MB.");
                return;
            }
            setCategoryImage(file);
            setImagePreview(URL.createObjectURL(file));
            setValidationError(''); // Pulisce l'errore di validazione quando un file viene scelto
        }
    };

    const resetForm = () => {
        setCategoryName('');
        setCategoryImage(null);
        setImagePreview(null);
        setValidationError('');
    };

    // 3. useEffect per gestire gli effetti collaterali (toast, chiusura, reset)
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearCategoryMessages());
            resetForm();
            onClose(); // Chiude la sidebar solo in caso di successo
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(clearCategoryMessages());
        }
    }, [successMessage, errorMessage, dispatch, onClose]);


    // 4. handleSubmit ora è più semplice
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!categoryName || !categoryImage) {
            setValidationError('Nome e immagine sono obbligatori.');
            return;
        }

        const formData = new FormData();
        formData.append('name', categoryName);
        formData.append('image', categoryImage);

        dispatch(addCategory(formData));
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 w-full md:w-[450px] h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 overflow-y-auto h-full flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 border-b pb-3">
                        <h3 className="text-xl font-bold text-gray-800">Crea Nuova Categoria</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors" aria-label="Chiudi">
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
                        <CustomInput
                            label="Nome Categoria"
                            name="categoryName"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Immagine</label>
                            <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-indigo-500 relative">
                                <input type="file" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Anteprima" className="max-h-32 object-contain rounded-md" />
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <FiUploadCloud size={40} className="mx-auto mb-2" />
                                        <p className="text-sm">Trascina o clicca per caricare</p>
                                        <p className="text-xs text-gray-400">PNG, JPG, GIF (Max 2MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {validationError && <p className="text-sm text-red-600">{validationError}</p>}

                        <div className="mt-auto pt-4 border-t">
                            {/* 5. Il loader viene preso direttamente da Redux */}
                            <CustomButton type="submit" className="w-full" loading={loader} disabled={loader}>
                                {loader ? 'Creazione in corso...' : 'Crea Categoria'}
                            </CustomButton>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateCategory;