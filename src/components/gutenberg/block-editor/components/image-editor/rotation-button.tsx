import { ToolbarButton } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { rotateRight as rotateRightIcon } from '@/components/gutenberg/icons';
import { useImageEditingContext } from './context';

export default function RotationButton() {
	const { isInProgress, rotateClockwise } = useImageEditingContext();
	return (
		<ToolbarButton
			icon={ rotateRightIcon }
			label={ __( 'Rotate' ) }
			onClick={ rotateClockwise }
			disabled={ isInProgress }
		/>
	);
}
