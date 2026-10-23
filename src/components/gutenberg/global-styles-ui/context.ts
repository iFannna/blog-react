import { createContext } from '@/lib/gutenberg/element';
import type { GlobalStylesConfig } from '@/lib/gutenberg/global-styles-engine';

export interface GlobalStylesContextType {
	user: GlobalStylesConfig;
	base: GlobalStylesConfig;
	merged: GlobalStylesConfig;
	onChange: ( newValue: GlobalStylesConfig ) => void;
	fontLibraryEnabled?: boolean;
}

export const GlobalStylesContext = createContext< GlobalStylesContextType >( {
	user: { styles: {}, settings: {} },
	base: { styles: {}, settings: {} },
	merged: { styles: {}, settings: {} },
	onChange: () => {},
	fontLibraryEnabled: false,
} );
