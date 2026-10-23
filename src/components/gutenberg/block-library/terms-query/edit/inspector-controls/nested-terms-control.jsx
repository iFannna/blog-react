import { ToggleControl } from '@/components/gutenberg/ui';

export default function NestedTermsControl( { value, onChange, ...props } ) {
	return (
		<ToggleControl checked={ value } onChange={ onChange } { ...props } />
	);
}
