import { SelectControl as WCSelectControl } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';

const stickyOptions = [
	{ label: __( 'Include' ), value: '' },
	{ label: __( 'Ignore' ), value: 'ignore' },
	{ label: __( 'Exclude' ), value: 'exclude' },
	{ label: __( 'Only' ), value: 'only' },
];

export default function StickyControl( { value, onChange } ) {
	return (
		<WCSelectControl
			label={ __( 'Sticky posts' ) }
			options={ stickyOptions }
			value={ value }
			onChange={ onChange }
			help={ __(
				'Sticky posts always appear first, regardless of their publish date.'
			) }
		/>
	);
}
