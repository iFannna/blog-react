import { createBlock, cloneSanitizedBlock } from '@/lib/gutenberg/blocks';

export default {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ '*' ],
			isMatch( {}, blocks ) {
				return ! (
					blocks.length === 1 && blocks[ 0 ].name === 'core/details'
				);
			},
			__experimentalConvert( blocks ) {
				return createBlock(
					'core/details',
					{},
					blocks.map( ( block ) => cloneSanitizedBlock( block ) )
				);
			},
		},
	],
};
