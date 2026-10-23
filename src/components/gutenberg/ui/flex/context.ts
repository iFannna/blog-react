import { createContext, useContext } from '@/lib/gutenberg/element';

export const FlexContext = createContext< {
	flexItemDisplay: 'block' | undefined;
} >( {
	flexItemDisplay: undefined,
} );

export const useFlexContext = () => useContext( FlexContext );
