import { createContext, useContext } from '@/lib/gutenberg/element';
import type { TabsContextProps } from './types';

export const TabsContext = createContext< TabsContextProps >( undefined );
TabsContext.displayName = 'TabsContext';

export const useTabsContext = () => useContext( TabsContext );
