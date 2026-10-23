import { useInsertionEffect } from '@/lib/gutenberg/element';
import { registerDocument } from '@/lib/gutenberg/style-runtime';
import type { StyleProviderProps } from './types';

export function StyleProvider( props: StyleProviderProps ) {
	const { children, document } = props;

	// Inject module styles before children measure layout, including in iframes.
	useInsertionEffect( () => {
		if ( ! document ) {
			return;
		}

		return registerDocument( document );
	}, [ document ] );

	if ( ! document ) {
		return null;
	}

	return <>{ children }</>;
}

export default StyleProvider;
