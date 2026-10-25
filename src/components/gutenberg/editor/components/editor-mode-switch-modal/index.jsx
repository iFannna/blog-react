import { __ } from '@/lib/gutenberg/i18n';
import { useDispatch, useSelect } from '@/stores/gutenberg/data';
import { Button, Modal } from '@/components/gutenberg/ui';
import { Stack } from '@/components/gutenberg/design-system';
import { store as editorStore } from '../../store';

/**
 * Confirms switching into or out of the Markdown editor, which discards the
 * current post content because the formats are not converted.
 *
 * @return {React.ReactNode} The rendered modal, or null when no switch is pending.
 */
export default function EditorModeSwitchModal() {
	const target = useSelect(
		( select ) => select( editorStore ).getEditorModeSwitchTarget(),
		[]
	);
	const { confirmEditorModeSwitch, cancelEditorModeSwitch } =
		useDispatch( editorStore );

	if ( ! target ) {
		return null;
	}

	return (
		<Modal
			title={ __( 'Switch editors?' ) }
			onRequestClose={ cancelEditorModeSwitch }
			closeButtonLabel={ __( 'Cancel' ) }
			className="editor-mode-switch-modal"
		>
			<p>
				{ __(
					'Switching editors discards the current content. Blocks and Markdown are not converted between each other.'
				) }
			</p>
			<Stack direction="row" gap="sm" justify="flex-end">
				<Button variant="tertiary" onClick={ cancelEditorModeSwitch }>
					{ __( 'Cancel' ) }
				</Button>
				<Button variant="primary" onClick={ confirmEditorModeSwitch }>
					{ __( 'Discard and switch' ) }
				</Button>
			</Stack>
		</Modal>
	);
}
