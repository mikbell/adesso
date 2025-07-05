import React, { useState } from 'react';
import TextInput from '../shared/CustomInput';
import Button from '../shared/Button';
import ToggleSwitch from '../shared/ToggleSwitch';

const SecuritySettings = () => {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [twoFactor, setTwoFactor] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Logica di validazione e salvataggio password
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Sicurezza</h2>
            <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-700">Cambia Password</h3>
                <TextInput label="Password Attuale" type="password" name="current" />
                <TextInput label="Nuova Password" type="password" name="new" />
                <TextInput label="Conferma Nuova Password" type="password" name="confirm" />
            </div>
            <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Autenticazione a Due Fattori (2FA)</h3>
                <ToggleSwitch label="Abilita 2FA" enabled={twoFactor} onChange={setTwoFactor} />
            </div>
            <div className="flex justify-end pt-4 border-t">
                <Button type="submit" loading={isSaving}>Salva Impostazioni di Sicurezza</Button>
            </div>
        </form>
    );
};

export default SecuritySettings;