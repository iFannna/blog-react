import { createContext } from '@/lib/gutenberg/element';
import type { ThemeProviderSettings } from './types.ts';

interface ThemeContextType {
	resolvedSettings: ThemeProviderSettings;
}

export const ThemeContext = createContext< ThemeContextType >( {
	resolvedSettings: {
		color: {},
		cursor: undefined,
		cornerRadius: undefined,
	},
} );
