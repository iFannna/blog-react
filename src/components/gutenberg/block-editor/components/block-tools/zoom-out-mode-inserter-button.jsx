import clsx from 'clsx';
import { Button } from '@/components/gutenberg/ui';
import { plus } from '@/components/gutenberg/icons';
import { _x } from '@/lib/gutenberg/i18n';

function ZoomOutModeInserterButton( { onClick } ) {
	return (
		<Button
			variant="primary"
			icon={ plus }
			size="compact"
			className={ clsx(
				'block-editor-button-pattern-inserter__button',
				'block-editor-block-tools__zoom-out-mode-inserter-button'
			) }
			onClick={ onClick }
			label={ _x(
				'Add pattern',
				'Generic label for pattern inserter button'
			) }
		/>
	);
}

export default ZoomOutModeInserterButton;
