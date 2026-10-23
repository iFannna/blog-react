import { createSlotFill } from '@/components/gutenberg/ui';

const { Fill: ToolsMoreMenuGroup, Slot } = createSlotFill(
	Symbol( 'ToolsMoreMenuGroup' )
);

ToolsMoreMenuGroup.Slot = Slot;

export default ToolsMoreMenuGroup;
