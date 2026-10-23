import type { createSlotFill } from '@/components/gutenberg/ui';

type SlotFill = ReturnType< typeof createSlotFill >;

/**
 * The inserter menu extension fill, which carries its slot as a static.
 */
export type InserterMenuExtension = SlotFill[ 'Fill' ] & {
	Slot: SlotFill[ 'Slot' ];
};
