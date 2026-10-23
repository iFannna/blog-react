import { __ } from '@/lib/gutenberg/i18n';
import { customLink as linkIcon } from '@/components/gutenberg/icons';

const variations = [
	{
		name: 'custom-link',
		title: __( 'Custom Link' ),
		description: __( 'Add a custom link to your navigation.' ),
		icon: linkIcon,
		attributes: {
			kind: 'custom',
		},
		isActive: ( blockAttributes ) => blockAttributes.kind === 'custom',
		isDefault: true,
		scope: [ 'inserter' ],
	},
];

export default variations;
