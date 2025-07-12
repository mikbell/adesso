import React, { useState } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import CustomButton from './CustomButton';
import CustomListbox from './CustomListbox';
import CustomInput from './CustomInput';
import { useDispatch } from 'react-redux'; // 1. Importa useDispatch
import { addCategory } from '../../store/reducers/categorySlice';
import { toast } from 'react-hot-toast';

const CreateCategory = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [categoryName, setCategoryName] = useState('');
    const [categoryStatus, setCategoryStatus] = useState('Attiva');
    const [categoryImage, setCategoryImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("L'immagine è troppo grande! La dimensione massima è 2MB.");
                e.target.value = '';
                return;
            }
            setCategoryImage(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setCategoryImage(null);
            setImagePreview(null);
        }
    };

    const resetForm = () => {
        setCategoryName('');
        setCategoryStatus('Attiva');
        setCategoryImage(null);
        setImagePreview(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName || !categoryImage) {
            setError('Nome della categoria e immagine sono obbligatori.');
            return;
        }

        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('name', categoryName);
        formData.append('status', categoryStatus);
        formData.append('image', categoryImage);

        try {
            // 3. Dispatch dell'azione invece della chiamata API diretta
            // unwrap() restituisce una Promise che viene risolta in caso di successo
            // o rigettata in caso di fallimento, permettendo di usare il blocco catch.
            await dispatch(addCategory(formData)).unwrap();

            // Se il dispatch ha successo, chiudi la sidebar e resetta il form
            onClose();
            resetForm();

        } catch (err) {
            // L'errore viene già gestito dal thunk, qui lo mostriamo solo
            console.error("Errore dall'interfaccia:", err);
            setError(err || "Si è verificato un errore.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 z-40"
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 w-full md:w-[450px] h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-6 overflow-y-auto h-full flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 border-b pb-3">
                        <h3 className="text-xl font-bold text-gray-800">Crea Nuova Categoria</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-800 transition-colors"
                            aria-label="Chiudi"
                        >
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
                        <CustomListbox
                            label="Stato Categoria"
                            options={[{ id: 'Attiva', name: 'Attiva' }, { id: 'Disattiva', name: 'Disattiva' }]}
                            onChange={(value) => setCategoryStatus(value.id)}
                            value={{ id: categoryStatus, name: categoryStatus }}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Immagine Categoria</label>
                            <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-indigo-500 transition-colors relative">
                                <input
                                    type="file"
                                    id="categoryImage"
                                    name="categoryImage"
                                    accept="image/png, image/jpeg, image/gif"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required
                                />
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Anteprima Categoria" className="max-w-full h-32 object-contain rounded-md mb-2" />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-500 text-center">
                                        <FiUploadCloud size={40} className="mb-2" />
                                        <p className="text-sm">Trascina un'immagine o clicca per selezionare</p>
                                        <p className="text-xs text-gray-400">Max 2MB (PNG, JPG, GIF)</p>
                                    </div>
                                )}
                                {imagePreview && (
                                    <p className="text-sm text-gray-600 mt-2 truncate max-w-full">{categoryImage?.name}</p>
                                )}
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                        <div className="mt-auto pt-4 border-t">
                            <CustomButton
                                type="submit"
                                className="w-full"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creazione...' : 'Crea Categoria'}
                            </CustomButton>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateCategory;