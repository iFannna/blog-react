import { __experimentalConfirmDialog as ConfirmDialog } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';

interface ConfirmResetDialogProps {
	text: string;
	confirmButtonText: string;
	isOpen: boolean;
	toggleOpen: () => void;
	onConfirm: () => void;
}

export default function ConfirmResetDialog( {
	text,
	confirmButtonText,
	isOpen,
	toggleOpen,
	onConfirm,
}: ConfirmResetDialogProps ) {
	return (
		<ConfirmDialog
			isOpen={ isOpen }
			cancelButtonText={ __( 'Cancel' ) }
			confirmButtonText={ confirmButtonText }
			onCancel={ toggleOpen }
			onConfirm={ () => {
				toggleOpen();
				onConfirm();
			} }
			size="medium"
		>
			{ text }
		</ConfirmDialog>
	);
}
