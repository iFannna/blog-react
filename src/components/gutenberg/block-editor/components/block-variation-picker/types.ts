import type { BlockTypeIcon, BlockVariation } from '@/lib/gutenberg/blocks';
import type { ComponentProps } from 'react';
import type { Placeholder } from '@/components/gutenberg/ui';

/**
 * A variation offered by `BlockVariationPicker`.
 */
export type PickableBlockVariation = Omit< BlockVariation, 'icon' > & {
	icon?: BlockTypeIcon;
};

/**
 * Props of `BlockVariationPicker`.
 */
export interface BlockVariationPickerProps {
	icon?: ComponentProps< typeof Placeholder >[ 'icon' ];
	label?: string;
	instructions?: string;
	variations: PickableBlockVariation[];
	onSelect: ( variation?: PickableBlockVariation ) => void;
	allowSkip?: boolean;
}
