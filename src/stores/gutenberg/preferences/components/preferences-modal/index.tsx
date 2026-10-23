import { Modal } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import type { PreferencesModalProps } from './types';

export default function PreferencesModal( {
	closeModal,
	children,
}: PreferencesModalProps ) {
	return (
		<Modal
			className="preferences-modal"
			title={ __( 'Preferences' ) }
			onRequestClose={ closeModal }
		>
			{ children }
		</Modal>
	);
}
