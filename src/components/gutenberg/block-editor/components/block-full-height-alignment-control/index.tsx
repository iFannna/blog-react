import { __ } from '@/lib/gutenberg/i18n';
import { ToolbarButton } from '@/components/gutenberg/ui';
import { fullHeight } from '@/components/gutenberg/icons';
import type { BlockFullHeightAlignmentControlProps } from './types';

function BlockFullHeightAlignmentControl( {
	isActive,
	label = __( 'Full height' ),
	onToggle,
	isDisabled,
}: BlockFullHeightAlignmentControlProps ) {
	return (
		<ToolbarButton
			isActive={ isActive }
			icon={ fullHeight }
			label={ label }
			onClick={ () => onToggle( ! isActive ) }
			disabled={ isDisabled }
		/>
	);
}

export default BlockFullHeightAlignmentControl;
