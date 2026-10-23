import { store as coreStore } from '@/stores/gutenberg/core-data';
import { useSelect } from '@/stores/gutenberg/data';
import { useMemo } from '@/lib/gutenberg/element';

/**
 * Retrieve publicly-queryable taxonomies.
 *
 * @return {Object[]} Array of public taxonomy objects.
 */
export function usePublicTaxonomies() {
	const taxonomies = useSelect(
		( select ) => select( coreStore ).getTaxonomies( { per_page: -1 } ),
		[]
	);
	return useMemo( () => {
		return (
			taxonomies?.filter(
				( { visibility } ) => visibility?.publicly_queryable
			) || []
		);
	}, [ taxonomies ] );
}
