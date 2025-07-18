import { FiEdit, FiTrash2 } from 'react-icons/fi';
import ActionsMenu from '../shared/ActionsMenu';

const CategoriesTableRow = ({ category, onEdit, onDelete }) => {

    const categoryActions = [
        {
            key: 'main-actions',
            items: [
                { label: 'Modifica', icon: FiEdit, onClick: onEdit },
            ]
        },
        {
            key: 'destructive-actions',
            items: [
                { label: 'Elimina', icon: FiTrash2, onClick: onDelete, isDestructive: true },
            ]
        }
    ];

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {category.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <img src={category.image} alt={category.name} className='w-16 h-16 object-cover' />
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
                <ActionsMenu item={category} actionGroups={categoryActions} />
            </td>
        </tr>
    );
};

export default CategoriesTableRow;