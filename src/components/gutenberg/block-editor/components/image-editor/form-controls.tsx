import { ToolbarButton } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { useImageEditingContext } from './context';

export default function FormControls() {
	const { isInProgress, apply, cancel } = useImageEditingContext();
	return (
		<>
			<ToolbarButton onClick={ apply } disabled={ isInProgress }>
				{ __( 'Apply' ) }
			</ToolbarButton>
			<ToolbarButton onClick={ cancel }>{ __( 'Cancel' ) }</ToolbarButton>
		</>
	);
}
