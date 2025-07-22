import React from 'react';
import {
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    TabGroup
} from '@headlessui/react';
import ProductReviews from './ProductReviews';
import ProductDescription from './ProductDescription';

const Tabs = ({ product, reviews, reviewsLoading, reviewsError, submitLoading, submitError, submitSuccess, handleReviewSubmit, user }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-10 mt-10 transition-colors duration-300">
            <TabGroup>
                <TabList className="flex space-x-6 border-b border-gray-200 mb-6">
                    <Tab as={React.Fragment}>
                        {({ selected }) => (
                            <button
                                className={`
                                            relative pb-3 text-base md:text-lg font-medium transition-colors duration-200
                                            focus:outline-none cursor-pointer
                                            ${selected
                                        ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600'
                                        : 'text-gray-500 hover:text-blue-500'}
                                        `}
                            >
                                Descrizione
                            </button>
                        )}
                    </Tab>
                    <Tab as={React.Fragment}>
                        {({ selected }) => (
                            <button
                                className={`
                                            relative pb-3 text-base md:text-lg font-medium transition-colors duration-200
                                            focus:outline-none cursor-pointer
                                            ${selected
                                        ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600'
                                        : 'text-gray-500 hover:text-blue-500'}
                                        `}
                            >
                                Recensioni ({product.numReviews})
                            </button>
                        )}
                    </Tab>
                </TabList>

                <TabPanels className="mt-6">
                    <TabPanel>
                        <ProductDescription description={product.description} />
                    </TabPanel>

                    <TabPanel>
                        <ProductReviews
                            productId={product._id}
                            reviews={reviews}
                            reviewsLoading={reviewsLoading}
                            reviewsError={reviewsError}
                            submitLoading={submitLoading}
                            submitError={submitError}
                            submitSuccess={submitSuccess}
                            handleReviewSubmit={handleReviewSubmit}
                            user={user}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

export default Tabs;
