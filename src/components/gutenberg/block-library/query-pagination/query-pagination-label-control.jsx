import { __ } from '@/lib/gutenberg/i18n';
import { ToggleControl } from '@/components/gutenberg/ui';

export function QueryPaginationLabelControl( { value, onChange } ) {
	return (
		<ToggleControl
			label={ __( 'Show label text' ) }
			help={ __( 'Make label text visible, e.g. "Next Page".' ) }
			onChange={ onChange }
			checked={ value === true }
		/>
	);
}
