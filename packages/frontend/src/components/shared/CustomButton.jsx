import React from 'react';
import { Link } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import { Button } from "@headlessui/react";
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Funzione helper per unire le classi con twMerge e clsx
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const CustomButton = React.forwardRef(({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    disabled = false,
    to,
    ...rest
}, ref) => {

    // Determina se il pulsante è effettivamente disabilitato
    const isDisabled = loading || disabled;

    // Definiamo le classi di base, varianti e dimensioni
    const baseClasses = `
        inline-flex items-center justify-center font-semibold whitespace-nowrap 
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        transition-all duration-300 ease-in-out transform 
        active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer
    `;

    const variantClasses = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl focus:ring-blue-400',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-full focus:ring-gray-300',
        danger: 'bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md focus:ring-red-400',
        success: 'bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md focus:ring-green-400',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-md focus:ring-yellow-400',
        info: 'bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-md focus:ring-indigo-400',
        link: 'text-blue-500 hover:text-blue-600 focus:ring-blue-400 hover:underline !p-0',
        outline: 'text-gray-800 border border-gray-300 rounded-full focus:ring-gray-300',
        ghost: 'text-gray-800 hover:text-gray-900 focus:ring-gray-300',
        google: 'bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md focus:ring-red-400 w-full',
        facebook: 'bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md focus:ring-blue-400 w-full',
    };

    const sizeClasses = {
        sm: 'py-1.5 px-4 text-sm gap-1.5 [&_svg]:w-4 [&_svg]:h-4',
        md: 'py-2.5 px-6 text-base gap-2 [&_svg]:w-5 [&_svg]:h-5',
        lg: 'py-3.5 px-7 text-lg gap-2.5 [&_svg]:w-6 [&_svg]:h-6',
    };

    // Uniamo tutte le classi usando la nostra funzione helper `cn`
    const allClasses = cn(
        baseClasses,
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        className
    );

    // Contenuto del pulsante, invariato
    const buttonContent = (
        <>
            {loading && <FiLoader className="animate-spin" />}
            {!loading && Icon && iconPosition === 'left' && <Icon />}
            {children}
            {!loading && Icon && iconPosition === 'right' && <Icon />}
        </>
    );

    // Determiniamo il componente da renderizzare e le props specifiche
    const componentProps = to
        ? { as: Link, to }
        : { as: 'button', type };

    return (
        <Button
            ref={ref}
            className={allClasses}
            disabled={isDisabled}
            {...componentProps}
            {...rest}
        >
            {buttonContent}
        </Button>
    );
});

export default CustomButton;