import { ToolbarButton } from '@/components/gutenberg/ui';
import { __, _n, sprintf } from '@/lib/gutenberg/i18n';
import {
	privateApis as blockEditorPrivateApis,
	store as blockEditorStore,
	// @ts-expect-error `@wordpress/block-editor` has no type declarations.
} from '@/components/gutenberg/block-editor';
import { useSelect } from '@/stores/gutenberg/data';
import { getUnregisteredTypeHandlerName } from '@/lib/gutenberg/blocks';
import { store as keyboardShortcutsStore } from '@/components/gutenberg/keyboard-shortcuts';
import { comment as commentIcon } from '@/components/gutenberg/icons';
import { unlock } from '../../lock-unlock';

const { NoteIconToolbarSlotFill } = unlock( blockEditorPrivateApis );

type NoteToolbarButtonProps = {
	clientId: string;
	count: number;
	onClick: () => void;
};

function NoteToolbarButton( {
	clientId,
	count,
	onClick,
}: NoteToolbarButtonProps ) {
	const { canAddNote, shortcut } = useSelect(
		( select ) => {
			const { getBlockName, isBlockValid } = select( blockEditorStore );
			const blockName = getBlockName( clientId );
			return {
				canAddNote:
					isBlockValid( clientId ) &&
					blockName !== 'core/freeform' &&
					blockName !== getUnregisteredTypeHandlerName(),
				shortcut: select(
					keyboardShortcutsStore
				).getShortcutRepresentation( 'core/editor/new-note' ),
			};
		},
		[ clientId ]
	);

	if ( ! canAddNote ) {
		return null;
	}

	return (
		<ToolbarButton
			icon={ commentIcon }
			label={
				count
					? sprintf(
							// translators: %d: Number of notes on the block.
							_n(
								'Add note (%d note)',
								'Add note (%d notes)',
								count
							),
							count
						)
					: __( 'Add note' )
			}
			shortcut={ shortcut ?? undefined }
			onClick={ onClick }
		/>
	);
}

type AddNoteToolbarButtonProps = {
	/**
	 * Number of notes on the selected block.
	 */
	count: number;

	/**
	 * Called with the block's client ID to start a new note.
	 */
	onClick: ( clientId: string ) => void;
};

export function AddNoteToolbarButton( {
	count,
	onClick,
}: AddNoteToolbarButtonProps ) {
	return (
		<NoteIconToolbarSlotFill.Fill>
			{ ( { clientIds }: { clientIds: string[] } ) =>
				clientIds.length === 1 && (
					<NoteToolbarButton
						clientId={ clientIds[ 0 ] }
						count={ count }
						onClick={ () => onClick( clientIds[ 0 ] ) }
					/>
				)
			}
		</NoteIconToolbarSlotFill.Fill>
	);
}
