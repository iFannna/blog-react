import { __, isRTL } from '@/lib/gutenberg/i18n';
import { Button } from '@/components/gutenberg/ui';
import { useSelect, useDispatch } from '@/stores/gutenberg/data';
import { displayShortcut, isAppleOS } from '@/utils/gutenberg/keycodes';
import { redo as redoIcon, undo as undoIcon } from '@/components/gutenberg/icons';
import { forwardRef } from '@/lib/gutenberg/element';
import { store as editorStore } from '../../store';

function EditorHistoryRedo( props, ref ) {
	const shortcut = isAppleOS()
		? displayShortcut.primaryShift( 'z' )
		: displayShortcut.primary( 'y' );

	const hasRedo = useSelect(
		( select ) => select( editorStore ).hasEditorRedo(),
		[]
	);
	const { redo } = useDispatch( editorStore );
	return (
		<Button
			__next40pxDefaultSize
			{ ...props }
			ref={ ref }
			icon={ ! isRTL() ? redoIcon : undoIcon }
			/* translators: button label text should, if possible, be under 16 characters. */
			label={ __( 'Redo' ) }
			shortcut={ shortcut }
			// If there are no redo levels we don't want to actually disable this
			// button, because it will remove focus for keyboard users.
			// See: https://github.com/WordPress/gutenberg/issues/3486
			aria-disabled={ ! hasRedo }
			onClick={ hasRedo ? redo : undefined }
			className="editor-history__redo"
		/>
	);
}

/** @typedef {React.Ref<HTMLElement>} Ref */

/**
 * Renders the redo button for the editor history.
 *
 * @param {Object} props - Props.
 * @param {Ref}    ref   - Forwarded ref.
 *
 * @return {React.ReactNode} The rendered component.
 */
export default forwardRef( EditorHistoryRedo );
