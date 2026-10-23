import { createContext } from '@/lib/gutenberg/element';
import type { CircularOptionPickerContextProps } from './types';

export const CircularOptionPickerContext =
	createContext< CircularOptionPickerContextProps >( {} );
CircularOptionPickerContext.displayName = 'CircularOptionPickerContext';
