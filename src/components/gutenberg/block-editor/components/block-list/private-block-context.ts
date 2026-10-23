import { createContext } from '@/lib/gutenberg/element';
import type { PrivateBlockContextValue } from './types';

export const PrivateBlockContext = createContext< PrivateBlockContextValue >(
	{}
);
PrivateBlockContext.displayName = 'PrivateBlockContext';
