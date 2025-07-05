import React, { useState } from 'react';
import Button from '../shared/Button';
import ToggleSwitch from '../shared/ToggleSwitch';
import { FiMail, FiSmartphone } from 'react-icons/fi';

const NotificationSettings = () => {
    // Stato per gestire le diverse preferenze di notifica
    const [settings, setSettings] = useState({
        email: {
            newOrders: true,
            newMessages: true,
            promotions: false,
            reports: true,
        },
        push: {
            newOrders: true,
            newMessages: false,
        },
    });
    const [isSaving, setIsSaving] = useState(false);

    // Gestore generico per aggiornare lo stato quando un interruttore viene attivato/disattivato
    const handleToggleChange = (category, settingName, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [settingName]: value,
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        console.log("Salvataggio impostazioni notifiche:", settings);
        // Simula una chiamata API
        setTimeout(() => {
            setIsSaving(false);
            alert('Impostazioni di notifica salvate!');
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-xl font-bold text-gray-800">Impostazioni Notifiche</h2>

            {/* Sezione Notifiche via Email */}
            <div className="p-4 border rounded-lg space-y-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2"><FiMail /> Notifiche via Email</h3>
                <ToggleSwitch
                    label="Avviso per nuovi ordini"
                    enabled={settings.email.newOrders}
                    onChange={(value) => handleToggleChange('email', 'newOrders', value)}
                />
                <ToggleSwitch
                    label="Avviso per nuovi messaggi"
                    enabled={settings.email.newMessages}
                    onChange={(value) => handleToggleChange('email', 'newMessages', value)}
                />
                <ToggleSwitch
                    label="Promozioni e novità"
                    enabled={settings.email.promotions}
                    onChange={(value) => handleToggleChange('email', 'promotions', value)}
                />
                <ToggleSwitch
                    label="Report settimanali sulle vendite"
                    enabled={settings.email.reports}
                    onChange={(value) => handleToggleChange('email', 'reports', value)}
                />
            </div>

            {/* Sezione Notifiche Push */}
            <div className="p-4 border rounded-lg space-y-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2"><FiSmartphone /> Notifiche Push (App Mobile)</h3>
                <ToggleSwitch
                    label="Avviso per nuovi ordini"
                    enabled={settings.push.newOrders}
                    onChange={(value) => handleToggleChange('push', 'newOrders', value)}
                />
                <ToggleSwitch
                    label="Avviso per nuovi messaggi"
                    enabled={settings.push.newMessages}
                    onChange={(value) => handleToggleChange('push', 'newMessages', value)}
                />
            </div>

            {/* Pulsante di Salvataggio */}
            <div className="flex justify-end pt-4 border-t">
                <Button type="submit" loading={isSaving} disabled={isSaving}>
                    {isSaving ? 'Salvataggio...' : 'Salva Preferenze'}
                </Button>
            </div>
        </form>
    );
};

export default NotificationSettings;