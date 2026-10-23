import { __ } from '@/lib/gutenberg/i18n';
import { search as icon } from '@/components/gutenberg/icons';
import initBlock from '../utils/init-block';
import metadata from './block.json';
import edit from './edit';
import variations from './variations';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	example: {
		attributes: { buttonText: __( 'Search' ), label: __( 'Search' ) },
		viewportWidth: 400,
	},
	variations,
	edit,
};

export const init = () => initBlock( { name, metadata, settings } );
