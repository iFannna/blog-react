import { __, isRTL } from '@/lib/gutenberg/i18n';
import { Button } from '@/components/gutenberg/ui';
import { useSelect, useDispatch } from '@/stores/gutenberg/data';
import { displayShortcut } from '@/utils/gutenberg/keycodes';
import { undo as undoIcon, redo as redoIcon } from '@/components/gutenberg/icons';
import { forwardRef } from '@/lib/gutenberg/element';
import { store as editorStore } from '../../store';

function EditorHistoryUndo( props, ref ) {
	const hasUndo = useSelect(
		( select ) => select( editorStore ).hasEditorUndo(),
		[]
	);
	const { undo } = useDispatch( editorStore );
	return (
		<Button
			__next40pxDefaultSize
			{ ...props }
			ref={ ref }
			icon={ ! isRTL() ? undoIcon : redoIcon }
			/* translators: button label text should, if possible, be under 16 characters. */
			label={ __( 'Undo' ) }
			shortcut={ displayShortcut.primary( 'z' ) }
			// If there are no undo levels we don't want to actually disable this
			// button, because it will remove focus for keyboard users.
			// See: https://github.com/WordPress/gutenberg/issues/3486
			aria-disabled={ ! hasUndo }
			onClick={ hasUndo ? undo : undefined }
			className="editor-history__undo"
		/>
	);
}

/** @typedef {React.Ref<HTMLElement>} Ref */

/**
 * Renders the undo button for the editor history.
 *
 * @param {Object} props - Props.
 * @param {Ref}    ref   - Forwarded ref.
 *
 * @return {React.ReactNode} The rendered component.
 */
export default forwardRef( EditorHistoryUndo );
