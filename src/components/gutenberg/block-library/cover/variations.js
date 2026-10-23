import { __ } from '@/lib/gutenberg/i18n';
import { cover } from '@/components/gutenberg/icons';

const variations = [
	{
		name: 'cover',
		title: __( 'Cover' ),
		description: __( 'Add an image or video with a text overlay.' ),
		attributes: { layout: { type: 'constrained' } },
		isDefault: true,
		icon: cover,
	},
];

export default variations;
