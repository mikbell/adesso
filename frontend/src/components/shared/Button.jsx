import React from 'react';
import { Link } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';

const Button = ({
    children,
    onClick,
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
}) => {
    // 1. Definiamo le classi base e quelle per gli stati
    const baseClasses = 'inline-flex items-center justify-center font-bold whitespace-nowrap rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out transform active:scale-98 cursor-pointer';
    const disabledClasses = 'disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none';

    // 2. Oggetti per mappare varianti e dimensioni alle classi CSS
    const variantClasses = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus:ring-blue-500',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 focus:ring-gray-400',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md focus:ring-red-500',
        outline: 'bg-transparent border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
        success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md focus:ring-emerald-500',
        dark: 'bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-700',
        link: 'text-blue-600 hover:underline bg-transparent shadow-none p-0',
        google: 'bg-red-600 hover:bg-red-700 text-white shadow-md focus:ring-red-500',
        facebook: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md focus:ring-blue-500',
    };

    const sizeClasses = {
        sm: 'py-1.5 px-3 text-sm gap-1.5 [&_svg]:w-4 [&_svg]:h-4',
        md: 'py-2.5 px-5 text-base gap-2 [&_svg]:w-5 [&_svg]:h-5',
        lg: 'py-3 px-6 text-lg gap-2.5 [&_svg]:w-6 [&_svg]:h-6',
    };

    // 3. Combiniamo le classi per ottenere la stringa finale
    const allClasses = [
        baseClasses,
        variantClasses[variant] || variantClasses.primary, // Fallback alla variante primaria
        sizeClasses[size] || sizeClasses.md, // Fallback alla dimensione media
        disabledClasses,
        className, // Aggiungiamo eventuali classi personalizzate passate dall'esterno
    ].join(' ').trim();

    // La logica per il contenuto e per il tipo di componente (Link o button) non cambia
    const isDisabled = disabled || loading;
    const Component = to ? Link : 'button';

    const buttonContent = (
        <>
            {loading && <FiLoader className="animate-spin" />}
            {!loading && Icon && iconPosition === 'left' && <Icon />}
            {children}
            {!loading && Icon && iconPosition === 'right' && <Icon />}
        </>
    );

    return (
        <Component
            className={allClasses}
            disabled={isDisabled}
            onClick={to && isDisabled ? (e) => e.preventDefault() : onClick}
            aria-disabled={to && isDisabled ? true : undefined}
            tabIndex={to && isDisabled ? -1 : undefined}
            {...(to ? { to } : { type })}
            {...rest}
        >
            {buttonContent}
        </Component>
    );
};

export default Button;