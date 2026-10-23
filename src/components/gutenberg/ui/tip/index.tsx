import { Icon, tip } from '@/components/gutenberg/icons';
import deprecated from '@/utils/gutenberg/deprecated';
import type { TipProps } from './types';

/**
 * Displays a contextual tip with a decorative light-bulb icon.
 *
 * @deprecated Use `Notice.Root` and `Notice.Description` from `@wordpress/ui` instead.
 */
export function Tip( props: TipProps ) {
	const { children } = props;

	deprecated( 'wp.components.Tip', {
		since: '7.2',
		version: '7.4',
		alternative: 'Notice from @wordpress/ui',
	} );

	return (
		<div className="components-tip">
			<Icon icon={ tip } />
			<p>{ children }</p>
		</div>
	);
}

export default Tip;
