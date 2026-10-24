import { gallery as icon } from '@/components/gutenberg/icons';
import initBlock from '../utils/init-block';
import deprecated from './deprecated';
import edit from './edit';
import metadata from './block.json';
import save from './save';
import transforms from './transforms';
import variations from './variations';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	example: {
		attributes: {
			columns: 2,
		},
		innerBlocks: [
			{
				name: 'core/image',
				attributes: {
					url: '/media/uploads/morning-ridge.svg',
				},
			},
			{
				name: 'core/image',
				attributes: {
					url: '/media/uploads/studio-shapes.svg',
				},
			},
		],
	},
	transforms,
	variations,
	edit,
	save,
	deprecated,
};

export const init = () => initBlock( { name, metadata, settings } );
