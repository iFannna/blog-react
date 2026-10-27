import { postCategories as icon } from '@/components/gutenberg/icons';
import { addFilter } from '@/hooks/gutenberg/hooks';
import initBlock from '../utils/init-block';
import metadata from './block.json';
import edit from './edit';
import enhanceVariations from './hooks';
import deprecated from './deprecated';
import variations from './variations';

const { name } = metadata;
export { metadata, name };

export const settings = {
	icon,
	edit,
	deprecated,
	variations,
};

export const init = () => {
	addFilter(
		'blocks.registerBlockType',
		'core/template-part',
		enhanceVariations
	);

	return initBlock( { name, metadata, settings } );
};
