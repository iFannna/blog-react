import { Button } from '@/components/gutenberg/ui';
import { useDispatch } from '@/stores/gutenberg/data';
import { __ } from '@/lib/gutenberg/i18n';
import { useEffect, useRef } from '@/lib/gutenberg/element';
import { store as editorStore } from '../../store';
import PostTextEditor from '../post-text-editor';
import PostTitleRaw from '../post-title/post-title-raw';

/**
 * Raw Markdown editor. Switching back to another mode discards this content,
 * so the switch goes through the confirmation modal.
 *
 * @param {Object}  props
 * @param {boolean} props.autoFocus Whether to focus the title on mount.
 *
 * @return {React.ReactNode} The rendered Markdown editor.
 */
export default function MarkdownEditor( { autoFocus = false } ) {
	const { switchEditorMode } = useDispatch( editorStore );
	const titleRef = useRef();

	useEffect( () => {
		if ( autoFocus ) {
			return;
		}
		titleRef?.current?.focus();
	}, [ autoFocus ] );

	return (
		<div className="editor-text-editor editor-markdown-editor">
			<div className="editor-text-editor__toolbar">
				<h2>{ __( 'Editing Markdown' ) }</h2>
				<Button
					__next40pxDefaultSize
					variant="tertiary"
					onClick={ () => switchEditorMode( 'visual' ) }
				>
					{ __( 'Exit Markdown editor' ) }
				</Button>
			</div>
			<div className="editor-text-editor__body">
				<PostTitleRaw ref={ titleRef } />
				<PostTextEditor
					label={ __( 'Type Markdown' ) }
					placeholder={ __( 'Start writing with Markdown' ) }
					className="editor-post-text-editor editor-post-markdown-editor"
				/>
			</div>
		</div>
	);
}
