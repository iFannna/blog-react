import { __ } from '@/lib/gutenberg/i18n';
import { useReducer } from '@/lib/gutenberg/element';
import { MenuItem } from '@/components/gutenberg/ui';
import { lockOutline, unlock } from '@/components/gutenberg/icons';
import useBlockLock from './use-block-lock';
import type { BlockLockControlProps } from './types';
import BlockLockModal from './modal';

export default function BlockLockMenuItem( {
	clientId,
}: BlockLockControlProps ) {
	const { canLock, isLocked } = useBlockLock( clientId );

	const [ isModalOpen, toggleModal ] = useReducer(
		( isActive: boolean ) => ! isActive,
		false
	);

	if ( ! canLock ) {
		return null;
	}

	const label = isLocked ? __( 'Unlock' ) : __( 'Lock' );

	return (
		<>
			<MenuItem
				icon={ isLocked ? unlock : lockOutline }
				onClick={ toggleModal }
				aria-expanded={ isModalOpen }
				aria-haspopup="dialog"
			>
				{ label }
			</MenuItem>
			{ isModalOpen && (
				<BlockLockModal clientId={ clientId } onClose={ toggleModal } />
			) }
		</>
	);
}
