import { __ } from '@/lib/gutenberg/i18n';
import { navigation as icon } from '@/components/gutenberg/icons';
import { select } from '@/stores/gutenberg/data';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { decodeEntities } from '@/utils/gutenberg/html-entities';
import initBlock from '../utils/init-block';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	example: {
		attributes: {
			overlayMenu: 'never',
		},
		innerBlocks: [
			{
				name: 'core/navigation-link',
				attributes: {
					// translators: 'Home' as in a website's home page.
					label: __( 'Home' ),
					url: 'https://make.wordpress.org/',
				},
			},
			{
				name: 'core/navigation-link',
				attributes: {
					// translators: 'About' as in a website's about page.
					label: __( 'About' ),
					url: 'https://make.wordpress.org/',
				},
			},
			{
				name: 'core/navigation-link',
				attributes: {
					// translators: 'Contact' as in a website's contact page.
					label: __( 'Contact' ),
					url: 'https://make.wordpress.org/',
				},
			},
		],
	},
	edit,
	save,
	__experimentalLabel: ( { ref } ) => {
		if ( ! ref ) {
			return;
		}

		const navigation = select( coreStore ).getEditedEntityRecord(
			'postType',
			'wp_navigation',
			ref
		);

		if ( ! navigation?.title ) {
			return;
		}

		return decodeEntities( navigation.title );
	},
	deprecated,
};

export const init = () => initBlock( { name, metadata, settings } );
