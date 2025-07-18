import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Unisce le classi CSS in modo intelligente, risolvendo i conflitti di Tailwind.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}