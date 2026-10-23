import { Icon as WCIcon } from '@/components/gutenberg/ui';
import { error as errorIcon } from '@/components/gutenberg/icons';
import { VisuallyHidden } from '@/components/gutenberg/design-system';

function FieldLabelContent( {
	showError,
	errorMessage,
	fieldLabel,
	errorId,
}: {
	showError?: boolean;
	errorMessage?: string;
	fieldLabel?: string;
	errorId: string;
} ) {
	if ( ! showError ) {
		return <>{ fieldLabel }</>;
	}

	return (
		<span className="dataforms-layouts-panel__field-label-error-content">
			<WCIcon icon={ errorIcon } size={ 16 } />
			<VisuallyHidden id={ errorId }>{ errorMessage }</VisuallyHidden>
			{ fieldLabel }
		</span>
	);
}

export default FieldLabelContent;
