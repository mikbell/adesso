// components/shared/CustomInput.jsx

import { Description, Field, Input, Label } from '@headlessui/react'
import clsx from 'clsx'

export default function CustomInput({ label, description, errorMessage, className, id, ...props }) {
    return (
        <Field className={clsx('w-full', className)}>
            <Label htmlFor={id} className="text-sm/6 font-medium text-black data-[invalid]:text-red-400">
                {label}
            </Label>

            {description && (
                <Description className="text-sm/6 text-black/50 data-[invalid]:text-red-400/80">
                    {description}
                </Description>
            )}

            <Input
                id={id}
                {...props}
                className={clsx(
                    'mt-1 block w-full rounded-lg border-none bg-black/5 px-3 py-2 text-sm/6 text-black',
                    'data-[invalid]:border data-[invalid]:border-red-500/80',
                    'data-focus:outline-2 data-focus:outline-offset-0 data-focus:outline-black/25'
                )}
            />

            {errorMessage && (
                <p id={`${id}-error`} className="mt-1 text-sm text-red-400">
                    {errorMessage}
                </p>
            )}
        </Field>
    );
}
