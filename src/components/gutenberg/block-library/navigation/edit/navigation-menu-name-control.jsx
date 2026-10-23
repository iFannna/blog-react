import { TextControl } from '@/components/gutenberg/ui';
import { useEntityProp } from '@/stores/gutenberg/core-data';
import { __ } from '@/lib/gutenberg/i18n';

export default function NavigationMenuNameControl() {
	const [ title, updateTitle ] = useEntityProp(
		'postType',
		'wp_navigation',
		'title'
	);

	return (
		<TextControl
			label={ __( 'Menu name' ) }
			value={ title }
			onChange={ updateTitle }
		/>
	);
}
