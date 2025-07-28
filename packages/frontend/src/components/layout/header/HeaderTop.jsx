import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Importa useDispatch e useSelector

// Importa i componenti necessari da Headless UI
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';

// Importa le icone
import { MdEmail } from "react-icons/md";
import { IoMdArrowDropdown, IoMdPhonePortrait } from "react-icons/io";
import { FaFacebookF, FaGithub, FaLinkedin, FaUser } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { CustomButton } from '@adesso/ui-components';
import { logout } from '@adesso/core-logic'; // Assicurati di importare l'azione di logout corretta

// Importa lo stile per le icone delle bandiere (assicurati che il percorso sia corretto)
import "/node_modules/flag-icons/css/flag-icons.min.css";


// --- Dati di Configurazione (facili da aggiornare) ---

const contactInfo = [
    { icon: <MdEmail size={16} />, text: 'supporto@adesso.it', href: 'mailto:supporto@adesso.it' },
    { icon: <IoMdPhonePortrait size={16} />, text: '+ (123) 456 7890', href: 'tel:+1234567890' },
];

const socialLinks = [
    { icon: <FaFacebookF />, href: '#', label: 'Facebook' },
    { icon: <FaXTwitter />, href: '#', label: 'X (Twitter)' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
    { icon: <FaGithub />, href: '#', label: 'GitHub' },
];

const languages = [
    { code: 'us', name: 'English' },
    { code: 'it', name: 'Italiano' },
];

// --- Componenti Modulari e Riutilizzabili ---

const ContactItem = ({ icon, text, href }) => (
    <a href={href} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-300">
        {icon}
        <span>{text}</span>
    </a>
);

const SocialLinks = () => (
    <div className="flex items-center gap-4 text-slate-500">
        {socialLinks.map(social => (
            <a key={social.label} href={social.href} aria-label={social.label} className="hover:text-blue-600 transition-colors duration-300">
                {social.icon}
            </a>
        ))}
    </div>
);

const LanguageSwitcher = () => {
    const [currentLang, setCurrentLang] = useState(languages[0]);

    return (
        <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <span className={`fi fi-${currentLang.code}`}></span>
                <IoMdArrowDropdown className="transition-transform duration-300 data-[open]:rotate-180" />
            </MenuButton>

            <MenuItems
                anchor="bottom end"
                className="w-32 origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none 
                            data-[closed]:scale-95 data-[closed]:opacity-0 z-50"
            >
                {languages.map(lang => (
                    <MenuItem key={lang.code}>
                        <button
                            onClick={() => setCurrentLang(lang)}
                            className="w-full text-left flex items-center gap-2 rounded-md px-3 py-1.5 text-slate-700
                                                data-[active]:bg-slate-100"
                        >
                            <span className={`fi fi-${lang.code}`}></span>
                            <span>{lang.name}</span>
                        </button>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
};

// --- Componente UserAuth con menu a tendina ---
const UserAuth = ({ userInfo }) => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="flex items-center gap-4 text-slate-600">
            {userInfo ? (
                // L'utente è loggato, mostra il menu a tendina
                <Menu as="div" className="relative">
                    <MenuButton className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-300 cursor-pointer">
                        <FaUser />
                        <span>{userInfo.name}</span>
                        <IoMdArrowDropdown className="transition-transform duration-300 data-[open]:rotate-180" />
                    </MenuButton>
                    <MenuItems
                        anchor="bottom end"
                        className="w-40 origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none 
                                    data-[closed]:scale-95 data-[closed]:opacity-0 z-50"
                    >
                        <MenuItem>
                            <Link to="/profile" className="block w-full text-left rounded-md px-3 py-2 text-slate-700 data-[active]:bg-slate-100">
                                Profilo
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left rounded-md px-3 py-2 text-red-500 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </MenuItem>
                    </MenuItems>
                </Menu>
            ) : (
                // L'utente non è loggato, mostra i pulsanti di login e registrazione
                <>
                    <Link to="/login" className="hover:text-blue-600 transition-colors duration-300">Login</Link>
                    <CustomButton to="/register" >
                        Sign Up
                    </CustomButton>
                </>
            )}
        </div>
    );
};

// --- Componente Principale ---

const HeaderTop = () => {
    const { userInfo } = useSelector((state) => state.auth);

    return (
        <header className='w-full bg-white/80 backdrop-blur-sm border-b border-slate-200 py-2.5 hidden md:block text-sm font-medium'>
            <div className='w-[90%] mx-auto flex items-center justify-between'>
                {/* Sezione Sinistra: Contatti */}
                <ul className='flex items-center gap-x-6'>
                    {contactInfo.map((item, index) => (
                        <li key={index}>
                            <ContactItem {...item} />
                        </li>
                    ))}
                </ul>

                {/* Sezione Destra: Social, Lingua, Utente */}
                <div className="flex items-center gap-5">
                    <SocialLinks />
                    <div className="h-5 w-px bg-slate-200" /> {/* Separatore verticale */}
                    <LanguageSwitcher />
                    <div className="h-5 w-px bg-slate-200" /> {/* Separatore verticale */}
                    <UserAuth userInfo={userInfo} />
                </div>
            </div>
        </header>
    );
};

export default HeaderTop;