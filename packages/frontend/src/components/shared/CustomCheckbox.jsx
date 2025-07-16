import React from 'react';
import { Checkbox, Field, Label } from '@headlessui/react';
import { FaCheck } from "react-icons/fa6";
import clsx from 'clsx';

/**
 * Un componente checkbox personalizzato che include la gestione degli errori.
 *
 * @param {object} props - Le props del componente.
 * @param {boolean} props.checked - Lo stato della checkbox.
 * @param {(checked: boolean) => void} props.onChange - Funzione di callback.
 * @param {string} [props.label] - Il testo dell'etichetta.
 * @param {string} [props.errorMessage] - Il messaggio di errore da visualizzare.
 * @param {string} [props.className] - Classi per il contenitore principale.
 * @param {string} [props.checkboxClassName] - Classi per l'elemento Checkbox.
 * @param {string} [props.labelClassName] - Classi per l'elemento Label.
 * @param {string} [props.errorClassName] - Classi per il messaggio di errore.
 */
const CustomCheckbox = ({
    checked,
    onChange,
    label,
    errorMessage, // <-- Nuova prop
    className,
    checkboxClassName,
    labelClassName,
    errorClassName  // <-- Nuova prop per lo stile dell'errore
}) => {
    // Determina se c'è un errore per applicare stili condizionali
    const hasError = !!errorMessage;

    return (
        // Il contenitore principale ora include lo spazio per il messaggio di errore
        <div className={clsx('w-full', className)}>
            <Field className="flex items-center gap-3">
                <Checkbox
                    checked={checked}
                    onChange={onChange}
                    className={clsx(
                        "group size-6 rounded-md bg-white/10 p-1 ring-1 ring-inset",
                        "focus:not-data-focus:outline-none data-focus:outline data-focus:outline-offset-2 data-focus:outline-white",
                        "data-checked:bg-white",
                        "cursor-pointer",
                        hasError ? 'ring-red-500' : 'ring-white/15 data-checked:ring-transparent',
                        checkboxClassName
                    )}
                >
                    <FaCheck className="hidden size-4 fill-black group-data-checked:block" />
                </Checkbox>
                {label && (
                    <Label className={clsx("cursor-pointer select-none text-sm italic text-gray-700", labelClassName)}>
                        {label}
                    </Label>
                )}
            </Field>

            {hasError && (
                <p
                    className={clsx(
                        'text-sm text-red-500 mt-1',
                        'ml-[calc(1.5rem+0.75rem)]',
                        errorClassName
                    )}
                >
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default CustomCheckbox;