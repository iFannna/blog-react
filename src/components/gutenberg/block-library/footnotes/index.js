import { formatListNumbered as icon } from '@/components/gutenberg/icons';
import { registerFormatType } from '@/components/gutenberg/rich-text';
import initBlock from '../utils/init-block';
import edit from './edit';
import metadata from './block.json';
import { formatName, format } from './format';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit,
};

export const init = () => {
	registerFormatType( formatName, format );
	initBlock( { name, metadata, settings } );
};
