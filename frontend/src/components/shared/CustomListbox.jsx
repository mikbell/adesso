import React from 'react';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';

const CustomListbox = ({ label, options, value, onChange }) => {
    return (
        <Listbox value={value} onChange={onChange}>
            {label && (
                <span className="block text-sm font-semibold text-gray-700 mb-1">
                    {label}
                </span>
            )}
            <div className="relative">
                <ListboxButton className="relative w-full cursor-pointer rounded-xl bg-white  border border-gray-300  py-2.5 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 transition-all">
                    <span className="block truncate">
                        {value?.name || 'Seleziona un\'opzione'}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <FiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </ListboxButton>

                <ListboxOptions className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white  py-1 text-sm shadow-lg ring-1 ring-black/10 focus:outline-none transition-all">
                    {options.map((option) => (
                        <ListboxOption
                            key={option.id}
                            value={option}
                            className="group relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900  hover:bg-indigo-50 data-[focus]:bg-indig ]:bg-indigo-600/20 transition-colors"
                        >
                            {({ selected }) => (
                                <>
                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                        {option.name}
                                    </span>
                                    {selected && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600 ">
                                            <FiCheck className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                    )}
                                </>
                            )}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
};

export default CustomListbox;
