import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd-MM-yyyy');
  } catch {
    return dateStr;
  }
}

export function formatDateForInput(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'yyyy-MM-dd');
  } catch {
    return '';
  }
}
