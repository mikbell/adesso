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
        outline: 'bg-transparent border border-indigo-500 text-indigo-600 hover:bg-indigo-50 rounded-full',
        ghost: 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-full',
        success: 'bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-md focus:ring-emerald-400',
        dark: 'bg-neutral-900 hover:bg-neutral-800 text-white rounded-full focus:ring-neutral-700',
        link: 'text-indigo-600 hover:underline bg-transparent p-0 shadow-none',
        google: 'bg-red-600 hover:bg-red-700 text-white w-full rounded-full shadow-md focus:ring-red-400',
        facebook: 'bg-blue-600 hover:bg-blue-700 text-white w-full rounded-full shadow-md focus:ring-blue-400',
    };

    const sizeClasses = {
        sm: 'py-1.5 px-4 text-sm gap-1.5 [&_svg]:w-4 [&_svg]:h-4',
        md: 'py-2.5 px-6 text-base gap-2 [&_svg]:w-5 [&_svg]:h-5',
        lg: 'py-3.5 px-7 text-lg gap-2.5 [&_svg]:w-6 [&_svg]:h-6',
    };

    const allClasses = [
        baseClasses,
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        className
    ].join(' ').trim();

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
