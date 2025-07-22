import React, { useState, useEffect } from 'react';
import { Rating, CustomButton } from '@adesso/ui-components'; // Importa Rating e CustomButton
import { toast } from 'react-hot-toast'; // Per i messaggi toast
import { Link } from "react-router-dom"

const ProductReviews = ({
    reviews,
    reviewsLoading,
    reviewsError,
    submitLoading,
    submitError,
    submitSuccess,
    handleReviewSubmit,
    user // Informazioni sull'utente loggato
}) => {
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');

    // Resetta il modulo dopo un invio riuscito
    useEffect(() => {
        if (submitSuccess) {
            setNewRating(0);
            setNewComment('');
        }
    }, [submitSuccess]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (newRating === 0 || newComment.trim() === '') {
            toast.error('Per favore, dai un voto e scrivi un commento.');
            return;
        }
        handleReviewSubmit(newRating, newComment);
    };

    return (
        <div className="text-gray-700 leading-relaxed text-base">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recensioni dei Clienti</h3>

            {reviewsLoading ? (
                <p>Caricamento recensioni...</p>
            ) : reviewsError ? (
                <p className="text-red-500">Errore nel caricamento delle recensioni: {reviewsError}</p>
            ) : reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                            <div className="flex items-center mb-2">
                                <Rating value={review.rating} />
                                <span className="ml-2 text-sm text-gray-600">
                                    {review.name || 'Utente sconosciuto'} - {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            {review.title && <p className="font-semibold text-gray-900 mb-1">{review.title}</p>}
                            <p className="text-sm text-gray-700">{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Non ci sono ancora recensioni per questo prodotto. Sii il primo a recensirlo!</p>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Lascia una Recensione</h3>

                {/* Condizionale per l'invio della recensione: solo se l'utente è loggato */}
                {user?.userInfo ? ( // Controlla se l'utente è loggato
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Voto</label>
                            {/* Assicurati che il tuo componente Rating di @adesso/ui-components sia interattivo.
                                Se non lo è, potresti dover usare un altro input o una libreria come 'react-rating'
                                e configurarla per l'input (es. con un componente come <ReactStars /> o simile) */}
                            <Rating value={newRating} onRatingChange={setNewRating} interactive /> {/* Assumendo 'interactive' e 'onRatingChange' */}
                            {newRating === 0 && <p className="text-red-500 text-sm mt-1">Seleziona un voto.</p>}
                        </div>
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Commento</label>
                            <textarea
                                id="comment"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows="4"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Scrivi qui la tua recensione..."
                                required
                            ></textarea>
                            {newComment.trim() === '' && <p className="text-red-500 text-sm mt-1">Il commento non può essere vuoto.</p>}
                        </div>
                        <CustomButton
                            type="submit"
                            className="w-full py-2"
                            disabled={submitLoading || newRating === 0 || newComment.trim() === ''} // Disabilita se in caricamento o campi vuoti
                        >
                            {submitLoading ? 'Invio...' : 'Invia Recensione'}
                        </CustomButton>
                        {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}
                    </form>
                ) : (
                    <p>
                        Per lasciare una recensione, per favore <Link to="/login" className="text-indigo-600 hover:underline">accedi</Link> o <Link to="/register" className="text-indigo-600 hover:underline">registrati</Link>.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;