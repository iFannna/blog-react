import { symbol as icon } from '@/components/gutenberg/icons';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { select } from '@/stores/gutenberg/data';
import { decodeEntities } from '@/utils/gutenberg/html-entities';
import initBlock from '../utils/init-block';
import metadata from './block.json';
import edit from './edit';
import deprecated from './deprecated';

const { name } = metadata;

export { metadata, name };

export const settings = {
	deprecated,
	edit,
	icon,
	__experimentalLabel: ( { ref } ) => {
		if ( ! ref ) {
			return;
		}

		const { hasEntityRecord, getEditedEntityRecord, getEntityRecord } =
			select( coreStore );
		// Match the block's edit component: use the `edit` record only once
		// it's loaded, so reading the label doesn't request it.
		const title = hasEntityRecord( 'postType', 'wp_block', ref )
			? getEditedEntityRecord( 'postType', 'wp_block', ref )?.title
			: getEntityRecord( 'postType', 'wp_block', ref, {
					context: 'view',
				} )?.title?.raw;
		if ( ! title ) {
			return;
		}

		return decodeEntities( title );
	},
};

export const init = () => initBlock( { name, metadata, settings } );
