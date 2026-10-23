import { MenuItem } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { useState } from '@/lib/gutenberg/element';
import { useSelect } from '@/stores/gutenberg/data';
import { store as keyboardShortcutsStore } from '@/components/gutenberg/keyboard-shortcuts';
import BlockRenameModal from './modal';

export default function BlockRenameControl( { clientId } ) {
	const [ renamingBlock, setRenamingBlock ] = useState( false );

	const shortcut = useSelect(
		( select ) =>
			select( keyboardShortcutsStore ).getShortcutRepresentation(
				'core/block-editor/rename'
			),
		[]
	);

	return (
		<>
			<MenuItem
				onClick={ () => {
					setRenamingBlock( true );
				} }
				aria-expanded={ renamingBlock }
				aria-haspopup="dialog"
				shortcut={ shortcut }
			>
				{ __( 'Rename' ) }
			</MenuItem>
			{ renamingBlock && (
				<BlockRenameModal
					clientId={ clientId }
					onClose={ () => setRenamingBlock( false ) }
				/>
			) }
		</>
	);
}
