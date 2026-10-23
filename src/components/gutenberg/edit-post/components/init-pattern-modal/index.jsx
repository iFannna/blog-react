import { useSelect, useDispatch } from '@/stores/gutenberg/data';
import { __, _x } from '@/lib/gutenberg/i18n';
import {
	Modal,
	Button,
	ToggleControl,
	TextControl,
} from '@/components/gutenberg/ui';
import { Stack } from '@/components/gutenberg/design-system';
import { useState } from '@/lib/gutenberg/element';
import { store as editorStore } from '@/components/gutenberg/editor';

export default function InitPatternModal() {
	const { editPost } = useDispatch( editorStore );
	const { isCleanNewPost } = useSelect( editorStore );
	const [ syncType, setSyncType ] = useState( undefined );
	const [ title, setTitle ] = useState( '' );
	const [ isModalOpen, setIsModalOpen ] = useState( () => isCleanNewPost() );

	if ( ! isModalOpen ) {
		return null;
	}

	return (
		<Modal
			title={ __( 'Create pattern' ) }
			onRequestClose={ () => {
				setIsModalOpen( false );
			} }
			overlayClassName="patterns-create-modal"
		>
			<form
				onSubmit={ ( event ) => {
					event.preventDefault();
					setIsModalOpen( false );
					editPost( {
						title,
						meta: {
							wp_pattern_sync_status: syncType,
						},
					} );
				} }
			>
				<Stack direction="column" gap="lg">
					<TextControl
						label={ __( 'Name' ) }
						value={ title }
						onChange={ setTitle }
						placeholder={ __( 'My pattern' ) }
						className="patterns-create-modal__name-input"
					/>
					<ToggleControl
						label={ _x( 'Synced', 'pattern (singular)' ) }
						help={ __(
							'Sync this pattern across multiple locations.'
						) }
						checked={ ! syncType }
						onChange={ () => {
							setSyncType( ! syncType ? 'unsynced' : undefined );
						} }
					/>
					<Stack justify="end">
						<Button
							__next40pxDefaultSize
							variant="primary"
							type="submit"
							disabled={ ! title }
							accessibleWhenDisabled
						>
							{ __( 'Create' ) }
						</Button>
					</Stack>
				</Stack>
			</form>
		</Modal>
	);
}
