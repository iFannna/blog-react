import { createSlotFill } from '@/components/gutenberg/ui';

const BlockInspectorPreTabsKey = Symbol( 'BlockInspectorPreTabs' );

export const {
	Fill: BlockInspectorPreTabsFill,
	Slot: BlockInspectorPreTabsSlot,
} = createSlotFill( BlockInspectorPreTabsKey );
