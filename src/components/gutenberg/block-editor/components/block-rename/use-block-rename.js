import { getBlockSupport } from '@/lib/gutenberg/blocks';

export default function useBlockRename( name ) {
	return {
		canRename: !! name && getBlockSupport( name, 'renaming', true ),
	};
}
