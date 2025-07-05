import React, { useState } from 'react';
import TextInput from '../shared/CustomInput'; // Il nostro input riutilizzabile
import Button from '../shared/Button';

const GeneralSettings = () => {
    const [settings, setSettings] = useState({
        storeName: 'La Bottega di Maria',
        language: 'it',
        currency: 'EUR',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        console.log("Salvataggio impostazioni generali:", settings);
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Impostazioni Generali</h2>
            <TextInput
                label="Nome Negozio"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
            />
            {/* In un'app reale, questi sarebbero dei CustomListbox */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Lingua</label>
                <select name="language" value={settings.language} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                    <option value="it">Italiano</option>
                    <option value="en">Inglese</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Valuta</label>
                <select name="currency" value={settings.currency} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                    <option value="EUR">EUR - Euro</option>
                    <option value="USD">USD - Dollaro Americano</option>
                </select>
            </div>
            <div className="flex justify-end pt-4 border-t">
                <Button type="submit" loading={isSaving}>Salva Modifiche</Button>
            </div>
        </form>
    );
};

export default GeneralSettings;