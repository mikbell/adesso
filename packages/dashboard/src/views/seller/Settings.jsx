import React, { useState } from 'react';
import clsx from 'clsx';

// Importa i pannelli delle singole sezioni
import GeneralSettings from '../../components/settings/GeneralSettings';
import SecuritySettings from '../../components/settings/SecuritySettings';
import NotificationSettings from '../../components/settings/NotificationSettings';

// Definiamo le schede disponibili
const tabs = [
    { id: 'general', label: 'Generale' },
    { id: 'security', label: 'Sicurezza' },
    { id: 'notifications', label: 'Notifiche' },
];

const Settings = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    // Funzione per renderizzare il pannello corretto in base alla scheda attiva
    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralSettings />;
            case 'security':
                return <SecuritySettings />;
            case 'notifications':
                return <NotificationSettings />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Impostazioni</h1>
                <p className="mt-1 text-gray-500">Gestisci le preferenze del tuo account e del negozio.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Navigazione delle schede */}
                <aside className="lg:w-1/4">
                    <nav className="flex flex-row lg:flex-col gap-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    'w-full text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium',
                                    activeTab === tab.id
                                        ? 'bg-indigo-600 text-white shadow'
                                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Contenuto della scheda attiva */}
                <main className="flex-1">
                    <div className="bg-white p-6 rounded-lg shadow">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;