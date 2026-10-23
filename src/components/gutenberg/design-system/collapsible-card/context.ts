import { createContext } from '@/lib/gutenberg/element';

type HeaderDescriptionIdContextValue = {
	registerDescriptionId: ( id: string ) => () => void;
};

export const HeaderDescriptionIdContext =
	createContext< HeaderDescriptionIdContextValue | null >( null );
