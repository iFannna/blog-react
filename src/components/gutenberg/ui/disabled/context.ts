import { createContext } from '@/lib/gutenberg/element';

const Context = createContext< boolean >( false );
Context.displayName = 'DisabledContext';

export default Context;
