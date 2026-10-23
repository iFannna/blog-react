import { postDate as icon } from '@/components/gutenberg/icons';
import initBlock from '../utils/init-block';
import metadata from './block.json';
import edit from './edit';
import deprecated from './deprecated';

const { name } = metadata;
export { metadata, name };

export const settings = {
	icon,
	edit,
	deprecated,
	example: {},
};

export const init = () => initBlock( { name, metadata, settings } );
