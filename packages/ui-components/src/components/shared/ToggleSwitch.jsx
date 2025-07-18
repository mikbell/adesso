import { Switch } from '@headlessui/react'
import clsx from 'clsx'

export default function ToggleSwitch({ label, description, enabled, onChange }) {
    return (
        <div as="div" className="flex items-center justify-between">
            <span className="flex flex-grow flex-col">
                <span className="text-sm font-medium text-zinc-900" passive>
                    {label}
                </span>
                {description && (
                    <span className="text-sm text-zinc-500">
                        {description}
                    </span>
                )}
            </span>

            <Switch
                checked={enabled}
                onChange={onChange}
                className={clsx(
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
                    'ui-checked:bg-indigo-600 ui-not-checked:bg-zinc-300'
                )}
            >
                <span
                    aria-hidden="true"
                    className={clsx(
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        'ui-checked:translate-x-5 ui-not-checked:translate-x-0'
                    )}
                />
            </Switch>
        </div>
    )
}