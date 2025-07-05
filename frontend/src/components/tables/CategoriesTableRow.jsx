import { FiEdit, FiTrash2 } from 'react-icons/fi';

const CategoriesTableRow = ({ category, onEdit, onDelete }) => {
    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {category.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <img src={category.image} alt={category.name}  className='w-16 h-16 object-cover'/>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                {category.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {category.productsCount}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {category.status}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={() => onEdit(category.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                    aria-label={`Modifica categoria ${category.name}`}
                >
                    <FiEdit size={18} />
                </button>
                <button
                    onClick={() => onDelete(category.id)}
                    className="text-red-600 hover:text-red-900 cursor-pointer"
                    aria-label={`Elimina categoria ${category.name}`}
                >
                    <FiTrash2 size={18} />
                </button>
            </td>
        </tr>
    );
};

export default CategoriesTableRow;