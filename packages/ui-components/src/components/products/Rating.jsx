import React from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { AiOutlineStar } from 'react-icons/ai';

const Rating = ({ value, text, starColor = 'text-amber-400', emptyStarColor = 'text-slate-300' }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (value >= i) {
            // Stella piena
            stars.push(<FaStar key={i} className={starColor} />);
        } else if (value >= i - 0.5) {
            // Mezza stella
            stars.push(<FaStarHalfAlt key={i} className={starColor} />);
        } else {
            // Stella vuota
            stars.push(<AiOutlineStar key={i} className={emptyStarColor} />);
        }
    }

    return (
        <div className="flex items-center gap-1"> {/* Aumentato gap per migliore spaziatura */}
            <div className="flex items-center gap-0.5">
                {stars}
            </div>
            {text && <span className="text-gray-600 text-sm ml-1">{text}</span>} {/* Aggiunto un leggero margine a sinistra */}
        </div>
    );
};

export default Rating;