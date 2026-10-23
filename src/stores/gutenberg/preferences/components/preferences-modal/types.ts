import type { Modal } from '@/components/gutenberg/ui';

type ModalProps = Parameters< typeof Modal >[ 0 ];

export type PreferencesModalProps = {
	closeModal: ModalProps[ 'onRequestClose' ];
	children: React.ReactNode;
};
