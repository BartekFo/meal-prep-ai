import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type AnyValue = Record<string, unknown>;

export type WithoutChild<T> = T extends { child?: AnyValue } ? Omit<T, 'child'> : T;
export type WithoutChildren<T> = T extends { children?: AnyValue } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null;
};
