import React, { useState } from 'react';
import { FiUploadCloud, FiImage, FiX } from 'react-icons/fi'; // Aggiungi FiX per il pulsante di chiusura
import Button from './Button'; // Assicurati che il percorso sia corretto

const CreateCategory = ({ isOpen, onClose, onSubmitSuccess }) => { // Nuove props per il controllo della sidebar
    const [categoryName, setCategoryName] = useState('');
    const [categoryStatus, setCategoryStatus] = useState('Attiva');
    const [categoryImage, setCategoryImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Stato per il caricamento del submit

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Controlla la dimensione del file (es. max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("L'immagine è troppo grande! Max 2MB.");
                e.target.value = ''; // Resetta l'input file
                setCategoryImage(null);
                setImagePreview(null);
                return;
            }
            setCategoryImage(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setCategoryImage(null);
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e) => { // Reso asincrono per simulare API call
        e.preventDefault();
        setIsLoading(true);

        // Simulazione di una chiamata API

        console.log('Nuova Categoria Da Salvare:', {
            name: categoryName,
            status: categoryStatus,
            image: categoryImage ? categoryImage.name : 'Nessuna immagine'
        });

        // Dopo il successo (o fallimento) della chiamata API
        setIsLoading(false);
        alert('Categoria aggiunta! (Simulazione)');

        // Reset del form
        setCategoryName('');
        setCategoryStatus('Attiva');
        setCategoryImage(null);
        setImagePreview(null);

        if (onSubmitSuccess) {
            onSubmitSuccess(); // Notifica il componente padre del successo
        }
        onClose(); // Chiudi la sidebar dopo l'invio
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/70 bg-opacity-50 z-40"
                    onClick={onClose} // Chiudi cliccando sull'overlay
                ></div>
            )}

            {/* Sidebar vera e propria */}
            <div
                className={`fixed top-0 right-0 w-full md:w-[450px] h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-6 overflow-y-auto h-full flex flex-col"> {/* Aggiunto overflow-y-auto */}
                    {/* Header della Sidebar */}
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

                    {/* Form della Categoria */}
                    <form onSubmit={handleSubmit} className="space-y-6 flex-grow"> {/* flex-grow per occupare spazio */}
                        {/* Nome Categoria */}
                        <div>
                            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">Nome Categoria</label>
                            <input
                                type="text"
                                id="categoryName"
                                name="categoryName"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                placeholder="Es. Elettronica, Abbigliamento, Libri..."
                                required
                            />
                        </div>

                        {/* Stato Categoria */}
                        <div>
                            <label htmlFor="categoryStatus" className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
                            <select
                                id="categoryStatus"
                                name="categoryStatus"
                                value={categoryStatus}
                                onChange={(e) => setCategoryStatus(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                required
                            >
                                <option value="Attiva">Attiva</option>
                                <option value="Non Attiva">Non Attiva</option>
                            </select>
                        </div>

                        {/* Input Immagine */}
                        <div>
                            <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700 mb-1">Immagine Categoria</label>
                            <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-indigo-500 transition-colors duration-200 relative">
                                <input
                                    type="file"
                                    id="categoryImage"
                                    name="categoryImage"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Anteprima Categoria" className="max-w-full h-32 object-contain rounded-md mb-2" />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-500">
                                        <FiUploadCloud size={40} className="mb-2" />
                                        <p className="text-sm">Trascina qui un'immagine o clicca per selezionare</p>
                                        <p className="text-xs text-gray-400">Max 2MB, formati: JPG, PNG, GIF</p>
                                    </div>
                                )}
                                {imagePreview && (
                                    <p className="text-sm text-gray-600 mt-2">{categoryImage?.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Bottone di invio */}
                        <div className="mt-auto"> {/* Spinge il bottone in basso se il form è lungo */}
                            <Button
                                type="submit"
                                className="w-full"
                                loading={isLoading} // Collega lo stato di caricamento
                                disabled={isLoading} // Disabilita quando in caricamento
                            >
                                {isLoading ? 'Creazione...' : 'Crea Categoria'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateCategory;