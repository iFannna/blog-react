import {
	Button,
	Flex,
	FlexItem,
	Modal,
	__experimentalVStack as VStack,
} from '@/components/gutenberg/ui';
import { useState } from '@/lib/gutenberg/element';
import { _x, __ } from '@/lib/gutenberg/i18n';
import { useDispatch } from '@/stores/gutenberg/data';
import { Text } from '@/components/gutenberg/design-system';
import { store as blockEditorStore } from '../../store';
import BlockManager from '../block-manager';

export default function BlockAllowedBlocksModal( {
	clientId,
	blockTypes,
	selectedBlockTypes,
	onClose,
} ) {
	const [ currentSelectedBlockTypes, setCurrentSelectedBlockTypes ] =
		useState( selectedBlockTypes );

	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const handleSubmit = () => {
		const isFullySelected =
			currentSelectedBlockTypes.length === blockTypes.length;
		const newBlockNames = currentSelectedBlockTypes.map(
			( { name } ) => name
		);
		updateBlockAttributes( clientId, {
			allowedBlocks: isFullySelected ? undefined : newBlockNames,
		} );
		onClose();
	};

	return (
		<Modal
			title={ _x( 'Manage allowed blocks', 'modal title' ) }
			onRequestClose={ onClose }
			overlayClassName="block-editor-block-allowed-blocks-modal"
			focusOnMount="firstContentElement"
			size="medium"
		>
			<VStack
				as="form"
				onSubmit={ ( e ) => {
					e.preventDefault();
					handleSubmit();
				} }
				spacing="4"
			>
				<Text>
					{ __(
						'Select which blocks can be added inside this container.'
					) }
				</Text>
				<BlockManager
					blockTypes={ blockTypes }
					selectedBlockTypes={ currentSelectedBlockTypes }
					onChange={ ( newSelectedBlockTypes ) => {
						setCurrentSelectedBlockTypes( newSelectedBlockTypes );
					} }
				/>
				<Flex
					className="block-editor-block-allowed-blocks-modal__actions"
					justify="flex-end"
					expanded={ false }
				>
					<FlexItem>
						<Button
							variant="tertiary"
							onClick={ onClose }
							__next40pxDefaultSize
						>
							{ __( 'Cancel' ) }
						</Button>
					</FlexItem>
					<FlexItem>
						<Button
							variant="primary"
							type="submit"
							__next40pxDefaultSize
						>
							{ __( 'Apply' ) }
						</Button>
					</FlexItem>
				</Flex>
			</VStack>
		</Modal>
	);
}
