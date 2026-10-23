import { createSlotFill } from '@/components/gutenberg/ui';

const { Fill: ViewMoreMenuGroup, Slot } = createSlotFill(
	Symbol( 'ViewMoreMenuGroup' )
);

ViewMoreMenuGroup.Slot = Slot;

export default ViewMoreMenuGroup;
