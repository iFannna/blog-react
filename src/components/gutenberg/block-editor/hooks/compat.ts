import { hasBlockSupport } from '@/lib/gutenberg/blocks';
import type { BlockType } from '@/lib/gutenberg/blocks';
import { addFilter } from '@/hooks/gutenberg/hooks';

function migrateLightBlockWrapper( settings: BlockType ): BlockType {
	const { apiVersion = 1 } = settings;
	if (
		apiVersion < 2 &&
		hasBlockSupport( settings, 'lightBlockWrapper', false )
	) {
		settings.apiVersion = 2;
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'core/compat/migrateLightBlockWrapper',
	migrateLightBlockWrapper
);
