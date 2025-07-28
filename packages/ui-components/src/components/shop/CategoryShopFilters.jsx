// src/ui-components/CategoryShopFilters.jsx
import React from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import CustomCheckbox from '../shared/CustomCheckbox';
import PriceRangeSlider from '../shared/PriceRangeSlider';
import Rating from '../products/Rating';
import CustomInput from '../shared/CustomInput';
import CustomButton from '../shared/CustomButton';

const ratings = [5, 4, 3, 2, 1];
const MAX_PRICE = 500; // Assicurati che questa costante sia coerente o passata tramite prop

const CategoryShopFilters = ({
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    selectedRating,
    setSelectedRating,
    showDiscountedOnly,
    setShowDiscountedOnly,
    resetFilters,
}) => {
    return (
        <div className="space-y-8 p-4 bg-white rounded-lg shadow-sm">
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
                                    value={priceRange}
                                    onChange={setPriceRange} // L'onChange aggiorna lo stato locale direttamente in CategoryShop
                                    onAfterChange={setPriceRange} // Al rilascio, aggiorna lo stato principale
                                />
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span>€{priceRange[0].toFixed(2)}</span>
                                    <span>€{priceRange[1].toFixed(2)}</span>
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

export default CategoryShopFilters;