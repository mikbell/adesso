import React from 'react';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { FiMoreVertical } from 'react-icons/fi';

/**
 * Un menu di azioni riutilizzabile.
 * @param {object} item - L'oggetto di dati per la riga corrente (es. product, order).
 * @param {array} actionGroups - Un array di gruppi di azioni. Ogni gruppo ha una chiave e un array di item.
 * Ogni item di azione è un oggetto: { label: string, icon: Component, onClick: function, isDestructive?: boolean }
 */
const ActionsMenu = ({ item, actionGroups }) => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex justify-center w-full p-2 text-sm font-medium text-gray-700 bg-white rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 cursor-pointer">
                <FiMoreVertical className="w-5 h-5" aria-hidden="true" />
            </MenuButton>
            <MenuItems className="absolute right-0 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
                {actionGroups.map((group) => (
                    <div key={group.key} className="px-1 py-1">
                        {group.items.map((action) => (
                            <MenuItem key={action.label}>
                                {({ active }) => {
                                    const baseClasses = 'group flex rounded-md items-center w-full px-2 py-2 text-sm';
                                    // Applica stili diversi per le azioni distruttive (es. Elimina)
                                    const destructiveClasses = action.isDestructive
                                        ? `${active ? 'bg-red-500 text-white' : 'text-red-600'}`
                                        : `${active ? 'bg-indigo-500 text-white' : 'text-gray-900'}`;

                                    return (
                                        <button
                                            onClick={() => action.onClick(item)}
                                            className={`${baseClasses} ${destructiveClasses}`}
                                        >
                                            <action.icon className="w-5 h-5 mr-2" aria-hidden="true" />
                                            {action.label}
                                        </button>
                                    );
                                }}
                            </MenuItem>
                        ))}
                    </div>
                ))}
            </MenuItems>
        </Menu>
    );
};

export default ActionsMenu;