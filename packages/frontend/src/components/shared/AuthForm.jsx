import React from 'react';
import { Fieldset, Legend } from '@headlessui/react';
import CustomButton from './CustomButton';

const AuthForm = ({
    title,
    subtitle,
    children,
    handleSubmit,
    loader,
    submitButtonText,
    loadingButtonText,
    socialLogins,
    footerLink,
}) => {
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex justify-center items-center p-4'>
            <Fieldset
                as="form"
                onSubmit={handleSubmit}
                noValidate
                className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-xl"
            >
                <div className='text-center'>
                    <Legend className='text-3xl font-extrabold text-gray-800'>
                        {title}
                    </Legend>
                    {subtitle && (
                        <p className='mt-2 italic text-gray-600'>
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    {children}
                </div>

                <CustomButton type="submit" className="w-full" loading={loader} disabled={loader}>
                    {loader ? loadingButtonText : submitButtonText}
                </CustomButton>

                {/* --- SEZIONE MIGLIORATA --- */}
                {socialLogins && (
                    <>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">Oppure</span>
                            </div>
                        </div>
                        {socialLogins}
                    </>
                )}

                {footerLink}
            </Fieldset>
        </div>
    );
};

export default AuthForm;