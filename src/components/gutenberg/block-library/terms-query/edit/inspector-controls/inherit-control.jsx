import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';

export default function InheritControl( { value, onChange, label } ) {
	return (
		<ToggleGroupControl
			label={ label }
			isBlock
			onChange={ ( newValue ) => {
				onChange( {
					inherit: newValue === 'default',
				} );
			} }
			help={
				value
					? __(
							'Display terms based on the current taxonomy archive. For hierarchical taxonomies, shows children of the current term. For non-hierarchical taxonomies, shows all terms.'
						)
					: __( 'Display terms based on specific criteria.' )
			}
			value={ value ? 'default' : 'custom' }
		>
			<ToggleGroupControlOption
				value="default"
				label={ __( 'Default' ) }
			/>
			<ToggleGroupControlOption value="custom" label={ __( 'Custom' ) } />
		</ToggleGroupControl>
	);
}
