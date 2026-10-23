import { createBlock } from '@/lib/gutenberg/blocks';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'core/site-title' ],
			transform: ( { isLink, linkTarget } ) => {
				return createBlock( 'core/site-title', {
					isLink,
					linkTarget,
				} );
			},
		},
	],
};

export default transforms;
