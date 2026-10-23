import { useRefEffect } from '@/hooks/gutenberg/compose';
import { useContext } from '@/lib/gutenberg/element';
import { IntersectionObserver } from '../';

export function useIntersectionObserver() {
	const observer = useContext( IntersectionObserver );
	return useRefEffect(
		( node ) => {
			if ( observer ) {
				observer.observe( node );
				return () => {
					observer.unobserve( node );
				};
			}
		},
		[ observer ]
	);
}
