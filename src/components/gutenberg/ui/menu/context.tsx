import { createContext } from '@/lib/gutenberg/element';
import type { ContextProps } from './types';

export const Context = createContext< ContextProps | undefined >( undefined );
Context.displayName = 'MenuContext';
