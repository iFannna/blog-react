import { createContext } from '@/lib/gutenberg/element';

export const slotNameContext = createContext< string | undefined >( undefined );
slotNameContext.displayName = '__unstableSlotNameContext';
