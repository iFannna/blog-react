import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';

/**
 * Overlay Visibility Control component.
 *
 * @param {Object}   props               Component props.
 * @param {string}   props.overlayMenu   Overlay menu setting ('never', 'mobile', 'always').
 * @param {Function} props.setAttributes Function to update block attributes.
 * @return {React.JSX.Element}                 The overlay visibility control.
 */
export default function OverlayVisibilityControl( {
	overlayMenu,
	setAttributes,
} ) {
	return (
		<ToggleGroupControl
			label={ __( 'Overlay Visibility' ) }
			aria-label={ __( 'Configure overlay visibility' ) }
			value={ overlayMenu }
			help={ __(
				'Collapses the navigation options in a menu icon opening an overlay.'
			) }
			onChange={ ( value ) => setAttributes( { overlayMenu: value } ) }
			isBlock
		>
			<ToggleGroupControlOption value="never" label={ __( 'Off' ) } />
			<ToggleGroupControlOption value="mobile" label={ __( 'Mobile' ) } />
			<ToggleGroupControlOption value="always" label={ __( 'Always' ) } />
		</ToggleGroupControl>
	);
}
