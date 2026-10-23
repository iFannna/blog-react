import type { ComponentProps, ReactNode } from 'react';
import type { SlotComponentProps, ToolbarGroup } from '@/components/gutenberg/ui';

/**
 * Props of `BlockControls`.
 */
export interface BlockControlsFillProps {
	group?: string;
	controls?: ComponentProps< typeof ToolbarGroup >[ 'controls' ];
	children?: ReactNode;
	__experimentalShareWithChildBlocks?: boolean;
}

/**
 * Props of `BlockControls.Slot`.
 */
export type BlockControlsSlotProps = Omit<
	Extract< SlotComponentProps, { bubblesVirtually: true } >,
	'name' | 'fillProps' | 'bubblesVirtually' | 'children'
> & {
	group?: string;
};
