// components/shared/CustomButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import { Button } from "@headlessui/react";
import { cn } from '../../utils/cn'; // -> Importa la funzione helper

const CustomButton = React.forwardRef(({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    className = '',
    to,
    ...rest
}, ref) => {
    const isDisabled = loading || rest.disabled;

    // Definiamo le classi base, le varianti e le dimensioni
    const baseClasses = "inline-flex items-center justify-center font-semibold whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";

    const variantClasses = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus:ring-indigo-500',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-transparent focus:ring-indigo-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500',
        success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm focus:ring-green-500',
        link: 'text-indigo-600 hover:text-indigo-700 focus:ring-indigo-500 underline !p-0 bg-transparent',
        outline: 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-indigo-500',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-indigo-500',
        google: 'bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md focus:ring-red-400', // Rimosso w-full
        facebook: 'bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md focus:ring-blue-400', // Rimosso w-full
    };

    const sizeClasses = {
        sm: 'py-1.5 px-3 text-xs gap-1.5 rounded-md [&_svg]:size-4',
        md: 'py-2 px-4 text-sm gap-2 rounded-lg [&_svg]:size-5',
        lg: 'py-2.5 px-5 text-base gap-2.5 rounded-lg [&_svg]:size-5',
    };

    // -> Il contenuto del pulsante è più pulito
    const buttonContent = (
        <>
            {loading && <FiLoader className="animate-spin" />}
            {!loading && Icon && <Icon />}
            <span>{children}</span>
        </>
    );

    // Se il bottone è un link, usa il componente Link di React Router
    if (to) {
        return (
            <Link
                ref={ref}
                to={to}
                className={cn(
                    baseClasses,
                    variantClasses[variant],
                    sizeClasses[size],
                    isDisabled && "opacity-50 cursor-not-allowed",
                    className
                )}
                {...rest}
            >
                {buttonContent}
            </Link>
        );
    }

    // Altrimenti, usa il componente Button di Headless UI
    return (
        <Button
            ref={ref}
            type={type}
            disabled={isDisabled}
            className={cn(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            {...rest}
        >
            {buttonContent}
        </Button>
    );
});

export default CustomButton;