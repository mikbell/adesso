import React from 'react';
import { Switch } from '@headlessui/react';
import { FiCheck } from 'react-icons/fi';
import clsx from 'clsx';

const ToggleSwitch = ({ enabled, onChange, label }) => {
    return (
        <div className="flex items-center gap-4">

            <Switch
                checked={enabled}
                onChange={onChange}
                className={clsx(
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    enabled ? 'bg-indigo-600' : 'bg-gray-200'
                )}
            >
                <span
                    aria-hidden="true"
                    className={clsx(
                        'pointer-events-none h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center',
                        enabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                >
                    {enabled && <FiCheck className="h-3 w-3 text-indigo-600" />}
                </span>
            </Switch>

            {label && (
                <span className="text-sm font-medium text-gray-700 cursor-pointer">
                    {label}
                </span>
            )}

        </div>
    );
};

export default ToggleSwitch;