import { useEffect } from '@/lib/gutenberg/element';
import { useDispatch } from '@/stores/gutenberg/data';
import {
	useShortcut,
	store as keyboardShortcutsStore,
} from '@/components/gutenberg/keyboard-shortcuts';
import { __ } from '@/lib/gutenberg/i18n';
import { store as editPostStore } from '../../store';

function KeyboardShortcuts() {
	const { toggleFullscreenMode } = useDispatch( editPostStore );
	const { registerShortcut } = useDispatch( keyboardShortcutsStore );

	useEffect( () => {
		registerShortcut( {
			name: 'core/edit-post/toggle-fullscreen',
			category: 'global',
			description: __( 'Enable or disable fullscreen mode.' ),
			keyCombination: {
				modifier: 'secondary',
				character: 'f',
			},
		} );
	}, [] );

	useShortcut( 'core/edit-post/toggle-fullscreen', () => {
		toggleFullscreenMode();
	} );

	return null;
}

export default KeyboardShortcuts;
