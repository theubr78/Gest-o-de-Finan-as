import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility para combinar classes Tailwind sem conflitos
 * Usado em todos os componentes para garantir que classes customizadas
 * sobrescrevam as padrões corretamente
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
