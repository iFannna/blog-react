import { Fill, ToolbarButton } from '@/components/gutenberg/ui';
import { displayShortcut } from '@/utils/gutenberg/keycodes';

export function RichTextToolbarButton( props ) {
	const { name, shortcutType, shortcutCharacter, ...buttonProps } = props;
	let shortcut;
	let fillName = 'RichText.ToolbarControls';

	if ( name ) {
		fillName += `.${ name }`;
	}

	if ( shortcutType && shortcutCharacter ) {
		shortcut = displayShortcut[ shortcutType ]( shortcutCharacter );
	}

	return (
		<Fill name={ fillName }>
			<ToolbarButton { ...buttonProps } shortcut={ shortcut } />
		</Fill>
	);
}
