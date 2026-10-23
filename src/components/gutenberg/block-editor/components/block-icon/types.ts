import type { BlockTypeIcon } from '@/lib/gutenberg/blocks';

export interface BlockIconProps {
	icon?: BlockTypeIcon | null;
	showColors?: boolean;
	className?: string;
	context?: string;
}
