import type * as Ariakit from '@ariakit/react';
import { createContext } from '@/lib/gutenberg/element';

const ToolbarContext = createContext< Ariakit.ToolbarStore | undefined >(
	undefined
);
ToolbarContext.displayName = 'ToolbarContext';

export default ToolbarContext;
