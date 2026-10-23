import { createSlotFill } from '@/components/gutenberg/ui';

const { Slot: ViewerSlot, Fill: ViewerFill } = createSlotFill(
	'BlockEditorLinkControlViewer'
);

export { ViewerSlot, ViewerFill };
export default ViewerSlot;
