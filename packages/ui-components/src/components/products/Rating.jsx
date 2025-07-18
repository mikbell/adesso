import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { AiOutlineStar } from 'react-icons/ai';

const Rating = ({ value }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= value) {
            stars.push(<FaStar key={i} className="text-amber-400" />);
        } else if (i === Math.ceil(value) && !Number.isInteger(value)) {
            stars.push(<FaStarHalfAlt key={i} className="text-amber-400" />);
        } else {
            stars.push(<AiOutlineStar key={i} className="text-slate-300" />);
        }
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
};

export default Rating;