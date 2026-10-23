import type { ReactNode } from 'react';
import { useMemo } from '@/lib/gutenberg/element';
import type { GlobalStylesConfig } from '@/lib/gutenberg/global-styles-engine';
import { mergeGlobalStyles } from '@/lib/gutenberg/global-styles-engine';
import { GlobalStylesContext } from './context';

interface GlobalStylesProviderProps {
	children: ReactNode;
	value: GlobalStylesConfig;
	baseValue: GlobalStylesConfig;
	onChange: ( newValue: GlobalStylesConfig ) => void;
	fontLibraryEnabled?: boolean;
}

export function GlobalStylesProvider( {
	children,
	value,
	baseValue,
	onChange,
	fontLibraryEnabled,
}: GlobalStylesProviderProps ) {
	// Compute merged with memoization since merging can be expensive
	const merged = useMemo( () => {
		return mergeGlobalStyles( baseValue, value );
	}, [ baseValue, value ] );

	const contextValue = useMemo(
		() => ( {
			user: value,
			base: baseValue,
			merged,
			onChange,
			fontLibraryEnabled,
		} ),
		[ value, baseValue, merged, onChange, fontLibraryEnabled ]
	);

	return (
		<GlobalStylesContext.Provider value={ contextValue }>
			{ children }
		</GlobalStylesContext.Provider>
	);
}
