import React from 'react';
import { Fieldset, Legend } from '@headlessui/react';
import CustomButton from './CustomButton';
import { cn } from '../../utils/cn'; // Assicurati di avere questo file di utilità

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
    className, // Aggiungiamo la prop className
}) => {
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex justify-center items-center p-4'>
            <Fieldset
                as="form"
                onSubmit={handleSubmit}
                noValidate
                // -> Usiamo cn() per unire le classi in modo sicuro
                className={cn(
                    "w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-xl",
                    className
                )}
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

                {socialLogins && (
                    <>
                        <div className="relative my-4">
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