import { createHigherOrderComponent, useDebounce } from '@/hooks/gutenberg/compose';
import { speak } from '@/utils/gutenberg/a11y';

/**
 * A Higher Order Component used to provide speak and debounced speak functions.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-a11y/#speak
 *
 * @param {React.ComponentType} Component The component to be wrapped.
 *
 * @return {React.ComponentType} The wrapped component.
 */
export default createHigherOrderComponent(
	( Component ) =>
		function WithSpokenMessages( props ) {
			return (
				<Component
					{ ...props }
					speak={ speak }
					debouncedSpeak={ useDebounce( speak, 500 ) }
				/>
			);
		},
	'withSpokenMessages'
);
