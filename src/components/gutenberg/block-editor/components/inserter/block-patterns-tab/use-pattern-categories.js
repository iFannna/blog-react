import { useMemo } from '@/lib/gutenberg/element';
import { __, _n, _x, sprintf } from '@/lib/gutenberg/i18n';
import { speak } from '@/utils/gutenberg/a11y';
import usePatternsState from '../hooks/use-patterns-state';
import {
	isPatternFiltered,
	allPatternsCategory,
	sitePatternsCategory,
	starterPatternsCategory,
	getPopulatedCategories,
	INSERTER_PATTERN_TYPES,
} from './utils';

export function usePatternCategories( rootClientId, sourceFilter = 'all' ) {
	const [ patterns, allCategories ] = usePatternsState(
		undefined,
		rootClientId
	);

	const filteredPatterns = useMemo(
		() =>
			sourceFilter === 'all'
				? patterns
				: patterns.filter(
						( pattern ) =>
							! isPatternFiltered( pattern, sourceFilter )
					),
		[ sourceFilter, patterns ]
	);

	// Remove any empty categories.
	const populatedCategories = useMemo( () => {
		const categories = getPopulatedCategories(
			filteredPatterns,
			allCategories
		);
		// The category constants are evaluated before the locale data loads,
		// so translate their labels here, at render time.
		if (
			filteredPatterns.some( ( pattern ) =>
				pattern.blockTypes?.includes( 'core/post-content' )
			)
		) {
			categories.unshift( {
				...starterPatternsCategory,
				label: __( 'Starter content' ),
			} );
		}
		if (
			filteredPatterns.some(
				( pattern ) => pattern.type === INSERTER_PATTERN_TYPES.user
			)
		) {
			categories.unshift( {
				...sitePatternsCategory,
				label: __( 'Site patterns' ),
			} );
		}
		if ( filteredPatterns.length > 0 ) {
			categories.unshift( {
				name: allPatternsCategory.name,
				label: _x( 'All', 'patterns' ),
			} );
		}
		speak(
			sprintf(
				/* translators: %d: number of categories . */
				_n(
					'%d category button displayed.',
					'%d category buttons displayed.',
					categories.length
				),
				categories.length
			)
		);
		return categories;
	}, [ allCategories, filteredPatterns ] );

	return populatedCategories;
}
