import { Description, Field, Input, Label, Textarea } from '@headlessui/react';
import { cn } from '../../utils/cn'; // Assicurati di avere questo file di utilità

/**
 * Un componente di input o textarea riutilizzabile e accessibile,
 * costruito con Headless UI e stilizzato con Tailwind CSS.
 *
 * @param {object} props - Le props del componente.
 * @param {string} props.id - ID univoco per collegare label e input.
 * @param {string} props.label - Il testo dell'etichetta sopra il campo.
 * @param {'input' | 'textarea'} [props.as='input'] - Determina se renderizzare un input o una textarea.
 * @param {string} [props.description] - Un testo descrittivo opzionale sotto l'etichetta.
 * @param {string} [props.errorMessage] - Messaggio di errore da visualizzare sotto il campo.
 * @param {string} [props.className] - Classi CSS aggiuntive per il contenitore principale.
 */
export default function CustomInput({
    label,
    description,
    errorMessage,
    className,
    id,
    as = 'input',
    ...props
}) {
    // Scegliamo il componente corretto da renderizzare (Input o Textarea)
    const Component = as === 'textarea' ? Textarea : Input;

    // Definiamo gli stili di base in modo organizzato
    const baseStyles = 'mt-1 block w-full appearance-none rounded-lg border bg-white px-3 py-2 text-sm/6 text-gray-800 transition placeholder:text-gray-400';

    const stateStyles = {
        default: 'border-gray-300',
        focus: 'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
        invalid: 'data-[invalid]:border-red-500 data-[invalid]:ring-1 data-[invalid]:ring-red-500/20'
    };

    const typeSpecificStyles = as === 'textarea' ? 'min-h-24 resize-y' : '';

    return (
        <Field className={cn('w-full', className)}>
            {label && (
                <Label htmlFor={id} className="block text-sm font-medium text-gray-800 data-[invalid]:text-red-600">
                    {label}
                </Label>
            )}

            {description && (
                <Description className="text-sm text-gray-500 data-[invalid]:text-red-500">
                    {description}
                </Description>
            )}

            <Component
                id={id}
                // Applica 'invalid' se c'è un messaggio di errore
                invalid={!!errorMessage}
                {...props}
                // Uniamo tutte le classi in modo sicuro
                className={cn(
                    baseStyles,
                    stateStyles.default,
                    stateStyles.focus,
                    stateStyles.invalid,
                    typeSpecificStyles
                )}
            />

            {errorMessage && (
                <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
                    {errorMessage}
                </p>
            )}
        </Field>
    );
}