import { createContext, useContext } from '@/lib/gutenberg/element';

export const AutocompleteGridContext = createContext( false );

export const useAutocompleteGridContext = () =>
	useContext( AutocompleteGridContext );
