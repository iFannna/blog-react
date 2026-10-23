import { observableMap } from '@/hooks/gutenberg/compose';
import { createContext } from '@/lib/gutenberg/element';
import warning from '@/utils/gutenberg/warning';
import type { SlotFillRegistry } from './types';

const initialValue: SlotFillRegistry = {
	slots: observableMap(),
	fills: observableMap(),
	registerSlot: () => {
		warning(
			'Components must be wrapped within `SlotFillProvider`. ' +
				'See https://developer.wordpress.org/block-editor/components/slot-fill/'
		);
	},
	unregisterSlot: () => {},
	updateSlot: () => {},
	registerFill: () => {},
	unregisterFill: () => {},
	updateFill: () => {},

	// This helps the provider know if it's using the default context value or not.
	isDefault: true,
};

const SlotFillContext = createContext( initialValue );
SlotFillContext.displayName = 'SlotFillContext';

export default SlotFillContext;
