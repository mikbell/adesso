// components/shared/CustomInput.jsx

import { Description, Field, Input, Label, Textarea } from '@headlessui/react'
import clsx from 'clsx'

// Ho aggiunto la prop "as" che può essere 'input' o 'textarea'.
// Di default, sarà 'input'.
export default function CustomInput({ label, description, errorMessage, className, id, as = 'input', ...props }) {

    // Decidiamo quale componente usare in base alla prop 'as'
    const Component = as === 'textarea' ? Textarea : Input;

    return (
        <Field className={clsx('w-full', className)}>
            <Label htmlFor={id} className="text-sm/6 font-medium text-zinc-900 data-[invalid]:text-red-600">
                {label}
            </Label>

            {description && (
                <Description className="text-sm/6 text-zinc-500 data-[invalid]:text-red-500">
                    {description}
                </Description>
            )}

            <Component
                id={id}
                {...props}
                className={clsx(
                    // Stili di base per entrambi input e textarea
                    'mt-1 block w-full appearance-none rounded-lg border border-zinc-900/10 bg-white px-3 py-2 text-sm/6 text-zinc-900 transition',
                    'placeholder:text-zinc-400',
                    // Stili per lo stato di FOCUS
                    'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                    // Stili per lo stato di ERRORE (invalid)
                    'data-[invalid]:border-red-500 data-[invalid]:ring-red-500/20',
                    // Stile specifico se è una textarea per consentire il ridimensionamento verticale
                    as === 'textarea' && 'min-h-24 resize-y'
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