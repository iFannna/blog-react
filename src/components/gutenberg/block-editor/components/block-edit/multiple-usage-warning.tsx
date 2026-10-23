import { getBlockType } from '@/lib/gutenberg/blocks';
import { Button } from '@/components/gutenberg/ui';
import { useDispatch } from '@/stores/gutenberg/data';
import { __ } from '@/lib/gutenberg/i18n';
import { store as blockEditorStore } from '../../store';
import Warning from '../warning';
import type { MultipleUsageWarningProps } from './types';

export function MultipleUsageWarning( {
	originalBlockClientId,
	name,
	onReplace,
}: MultipleUsageWarningProps ) {
	const { selectBlock } = useDispatch( blockEditorStore );
	const blockType = getBlockType( name );

	return (
		<Warning
			actions={ [
				<Button
					__next40pxDefaultSize
					key="find-original"
					variant="secondary"
					onClick={ () => selectBlock( originalBlockClientId ) }
				>
					{ __( 'Find original' ) }
				</Button>,
				<Button
					__next40pxDefaultSize
					key="remove"
					variant="secondary"
					onClick={ () => onReplace( [] ) }
				>
					{ __( 'Remove' ) }
				</Button>,
			] }
		>
			<strong>{ blockType?.title }: </strong>
			{ __( 'This block can only be used once.' ) }
		</Warning>
	);
}
