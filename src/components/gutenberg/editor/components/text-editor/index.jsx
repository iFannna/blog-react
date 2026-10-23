import { Button } from '@/components/gutenberg/ui';
import { useDispatch, useSelect } from '@/stores/gutenberg/data';
import { __ } from '@/lib/gutenberg/i18n';
import { store as keyboardShortcutsStore } from '@/components/gutenberg/keyboard-shortcuts';
import { useEffect, useRef } from '@/lib/gutenberg/element';
import { store as editorStore } from '../../store';
import PostTextEditor from '../post-text-editor';
import PostTitleRaw from '../post-title/post-title-raw';

export default function TextEditor( { autoFocus = false } ) {
	const { switchEditorMode } = useDispatch( editorStore );
	const { shortcut, isRichEditingEnabled } = useSelect( ( select ) => {
		const { getEditorSettings } = select( editorStore );
		const { getShortcutRepresentation } = select( keyboardShortcutsStore );

		return {
			shortcut: getShortcutRepresentation( 'core/editor/toggle-mode' ),
			isRichEditingEnabled: getEditorSettings().richEditingEnabled,
		};
	}, [] );

	const titleRef = useRef();
	useEffect( () => {
		if ( autoFocus ) {
			return;
		}
		titleRef?.current?.focus();
	}, [ autoFocus ] );

	return (
		<div className="editor-text-editor">
			{ isRichEditingEnabled && (
				<div className="editor-text-editor__toolbar">
					<h2>{ __( 'Editing code' ) }</h2>
					<Button
						__next40pxDefaultSize
						variant="tertiary"
						onClick={ () => switchEditorMode( 'visual' ) }
						shortcut={ shortcut }
					>
						{ __( 'Exit code editor' ) }
					</Button>
				</div>
			) }
			<div className="editor-text-editor__body">
				<PostTitleRaw ref={ titleRef } />
				<PostTextEditor />
			</div>
		</div>
	);
}
