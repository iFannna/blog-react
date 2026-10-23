import deprecated from '@/utils/gutenberg/deprecated';
import { forwardRef } from '@/lib/gutenberg/element';

function ToolSelector() {
	deprecated( 'wp.blockEditor.ToolSelector', {
		since: '6.9',
		hint: 'The ToolSelector component no longer renders anything.',
	} );

	return null;
}

/**
 * This component has been deprecated and no longer renders anything.
 */
export default forwardRef( ToolSelector );
