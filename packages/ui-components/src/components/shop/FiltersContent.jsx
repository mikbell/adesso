// src/ui-components/FiltersContent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import CustomCheckbox from '../shared/CustomCheckbox'; // Assicurati che il percorso sia corretto
import PriceRangeSlider from '../shared/PriceRangeSlider'; // Assicurati che il percorso sia corretto
import Rating from '../products/Rating'; // Assicurati che il percorso sia corretto
import CustomInput from '../shared/CustomInput'; // Assicurati che il percorso sia corretto
import CustomButton from '../shared/CustomButton';

const ratings = [5, 4, 3, 2, 1];
const MAX_PRICE = 500; // Assicurati che questa costante sia accessibile o passata come prop se MAX_PRICE può variare

const FiltersContent = ({
    searchQuery,
    setSearchQuery,
    selectedCategories,
    handleCategoryChange,
    priceRange,
    setPriceRange,
    selectedRating,
    setSelectedRating,
    showDiscountedOnly,
    setShowDiscountedOnly,
    displayCategories,
    resetFilters,
    categoriesLoader
}) => {
    // Stato locale per gestire il valore dello slider durante il trascinamento
    const [localPriceRange, setLocalPriceRange] = useState(priceRange);

    // Sincronizza lo stato locale con la prop `priceRange` dal padre
    useEffect(() => {
        setLocalPriceRange(priceRange);
    }, [priceRange]);

    // Funzione per gestire il cambio del prezzo al rilascio dello slider
    const handlePriceRangeAfterChange = useCallback((value) => {
        setPriceRange(value);
    }, [setPriceRange]);

    return (
        <div className="space-y-8 divide-y divide-gray-200">
            {/* Sezione Ricerca */}
            <Disclosure as="div" defaultOpen={true}>
                {({ open }) => (
                    <>
                        <h3 className="-mx-2 -my-3 flow-root">
                            <DisclosureButton className="flex w-full items-center justify-between bg-gray-50 px-2 py-3 text-sm text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">Ricerca</span>
                                <span className="ml-6 flex items-center">
                                    <FiChevronDown className={open ? '-rotate-180 transform' : 'rotate-0 transform'} size={20} />
                                </span>
                            </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-6">
                            <div className="space-y-4">
                                <CustomInput
                                    id="search-filter"
                                    type="text"
                                    placeholder="Cerca per nome..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    icon={<FiSearch className="text-gray-400" />}
                                />
                            </div>
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>

            {/* Sezione Categorie */}
            <Disclosure as="div" defaultOpen={true} className="pt-8">
                {({ open }) => (
                    <>
                        <h3 className="-mx-2 -my-3 flow-root">
                            <DisclosureButton className="flex w-full items-center justify-between bg-gray-50 px-2 py-3 text-sm text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">Categorie</span>
                                <span className="ml-6 flex items-center">
                                    <FiChevronDown className={open ? '-rotate-180 transform' : 'rotate-0 transform'} size={20} />
                                </span>
                            </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-6 h-60 overflow-y-auto">
                            <div className="space-y-4">
                                {categoriesLoader ? (
                                    <div className="animate-pulse space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                ) : (
                                    displayCategories.map((category) => (
                                        <CustomCheckbox
                                            key={category}
                                            id={`category-${category}`}
                                            label={category}
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                        />
                                    ))
                                )}
                            </div>
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>

            {/* Sezione Fascia di Prezzo */}
            <Disclosure as="div" defaultOpen={true} className="pt-8">
                {({ open }) => (
                    <>
                        <h3 className="-mx-2 -my-3 flow-root">
                            <DisclosureButton className="flex w-full items-center justify-between bg-gray-50 px-2 py-3 text-sm text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">Prezzo</span>
                                <span className="ml-6 flex items-center">
                                    <FiChevronDown className={open ? '-rotate-180 transform' : 'rotate-0 transform'} size={20} />
                                </span>
                            </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-6">
                            <div className="space-y-4">
                                <PriceRangeSlider
                                    min={0}
                                    max={MAX_PRICE}
                                    values={localPriceRange}
                                    onChange={setLocalPriceRange}
                                    onAfterChange={handlePriceRangeAfterChange}
                                />
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span>€{localPriceRange[0].toFixed(2)}</span>
                                    <span>€{localPriceRange[1].toFixed(2)}</span>
                                </div>
                            </div>
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>

            {/* Sezione Valutazione */}
            <Disclosure as="div" defaultOpen={true} className="pt-8">
                {({ open }) => (
                    <>
                        <h3 className="-mx-2 -my-3 flow-root">
                            <DisclosureButton className="flex w-full items-center justify-between bg-gray-50 px-2 py-3 text-sm text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">Valutazione</span>
                                <span className="ml-6 flex items-center">
                                    <FiChevronDown className={open ? '-rotate-180 transform' : 'rotate-0 transform'} size={20} />
                                </span>
                            </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-6">
                            <div className="space-y-4">
                                {ratings.map((ratingValue) => (
                                    <CustomCheckbox
                                        key={ratingValue}
                                        id={`rating-${ratingValue}`}
                                        label={
                                            <div className="flex items-center gap-1">
                                                <Rating value={ratingValue} readonly={true} />
                                                <span className="text-gray-700">&amp; Su</span>
                                            </div>
                                        }
                                        checked={selectedRating === ratingValue}
                                        onChange={() => setSelectedRating(selectedRating === ratingValue ? 0 : ratingValue)}
                                    />
                                ))}
                            </div>
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>

            {/* Pulsante Reset Filtri */}
            <div className="pt-8">
                <CustomButton
                    onClick={resetFilters}
                    className="w-full"
                >
                    Resetta Filtri
                </CustomButton>
            </div>
        </div>
    );
};

export default FiltersContent;