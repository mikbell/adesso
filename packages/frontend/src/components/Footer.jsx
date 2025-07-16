import React from 'react';
import { Link } from 'react-router-dom';

// Importa le icone
import { FiSend } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcStripe } from 'react-icons/fa';

// --- Dati per le colonne di link (facili da aggiornare) ---
const usefulLinks = [
    { name: 'Chi Siamo', path: '/about' },
    { name: 'Contattaci', path: '/contact' },
    { name: 'Il Nostro Blog', path: '/blog' },
    { name: 'Termini e Condizioni', path: '/terms' },
];

const popularCategories = [
    { name: 'Elettronica', path: '/products?category=Elettronica' },
    { name: 'Abbigliamento', path: '/products?category=Abbigliamento' },
    { name: 'Casa e Cucina', path: '/products?category=Casa' },
    { name: 'Sport e Tempo Libero', path: '/products?category=Sport' },
];

const customerService = [
    { name: 'Domande Frequenti (FAQ)', path: '/faq' },
    { name: 'Politica di Spedizione', path: '/shipping' },
    { name: 'Politica sui Resi', path: '/returns' },
    { name: 'Traccia il tuo Ordine', path: '/track-order' },
];

const socialLinks = [
    { icon: <FaFacebookF />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaLinkedinIn />, href: '#', label: 'LinkedIn' },
];

const paymentMethods = [
    { icon: <FaCcVisa size={32} />, label: 'Visa' },
    { icon: <FaCcMastercard size={32} />, label: 'Mastercard' },
    { icon: <FaCcPaypal size={32} />, label: 'PayPal' },
    { icon: <FaCcStripe size={32} />, label: 'Stripe' },
];

// Componente per una colonna di link
const FooterLinkGroup = ({ title, links }) => (
    <div>
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <ul className="space-y-2">
            {links.map(link => (
                <li key={link.name}>
                    <Link to={link.path} className="text-slate-300 hover:text-white hover:underline transition-colors">
                        {link.name}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);


const Footer = () => {
    return (
        <footer className="bg-slate-800 text-slate-200">
            {/* Sezione Principale del Footer */}
            <div className="w-[85%] lg:w-[90%] mx-auto py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Colonna 1: Info e Newsletter */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <h2 className="text-2xl font-bold text-white mb-4">Adesso</h2>
                        <p className="text-slate-300 mb-6">
                            Il tuo negozio di fiducia per prodotti di qualità, con spedizioni veloci e un servizio clienti imbattibile.
                        </p>
                        <form className="flex items-center">
                            <input
                                type="email"
                                placeholder="La tua email"
                                className="w-full px-4 py-2.5 rounded-l-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                aria-label="Iscriviti alla newsletter"
                                className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700 transition-colors"
                            >
                                <FiSend size={20} />
                            </button>
                        </form>
                    </div>

                    {/* Colonna 2: Link Utili */}
                    <FooterLinkGroup title="Link Utili" links={usefulLinks} />

                    {/* Colonna 3: Categorie */}
                    <FooterLinkGroup title="Categorie Popolari" links={popularCategories} />

                    {/* Colonna 4: Servizio Clienti */}
                    <FooterLinkGroup title="Servizio Clienti" links={customerService} />

                </div>
            </div>

            {/* Barra Inferiore del Footer */}
            <div className="bg-slate-900 py-6">
                <div className="w-[85%] lg:w-[90%] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <p className="text-sm text-slate-400 text-center md:text-left">
                        &copy; {new Date().getFullYear()} Adesso. Tutti i diritti riservati.
                    </p>

                    {/* Social e Pagamenti */}
                    <div className="flex items-center gap-8">
                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map(social => (
                                <a key={social.label} href={social.href} aria-label={social.label} className="text-slate-400 hover:text-white transition-colors">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                        {/* Payment Methods */}
                        <div className="hidden sm:flex items-center gap-3 text-slate-400">
                            {paymentMethods.map(method => (
                                <div key={method.label} aria-label={method.label}>
                                    {method.icon}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
