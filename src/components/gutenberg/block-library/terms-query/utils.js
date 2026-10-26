import { store as coreStore } from '@/stores/gutenberg/core-data';
import { useSelect } from '@/stores/gutenberg/data';
import { useMemo } from '@/lib/gutenberg/element';
import { __ } from '@/lib/gutenberg/i18n';
import { getProjectTermAdapter } from '@/services/gutenberg/project/terms';

/**
 * Retrieve publicly-queryable taxonomies.
 *
 * 项目编辑器只有分类和标签两种扁平分类法，直接返回项目定义，
 * 不再读取 core-data 里的 WP 分类法。
 *
 * @return {Object[]} Array of public taxonomy objects.
 */
export function usePublicTaxonomies() {
	const projectActive = !! getProjectTermAdapter();
	const taxonomies = useSelect(
		( select ) => {
			if ( projectActive ) {
				return null;
			}
			return select( coreStore ).getTaxonomies( { per_page: -1 } );
		},
		[ projectActive ]
	);
	return useMemo( () => {
		if ( projectActive ) {
			return [
				{
					slug: 'category',
					name: __( 'Categories' ),
					hierarchical: false,
					visibility: { publicly_queryable: true },
				},
				{
					slug: 'post_tag',
					name: __( 'Tags' ),
					hierarchical: false,
					visibility: { publicly_queryable: true },
				},
			];
		}
		return (
			taxonomies?.filter(
				( { visibility } ) => visibility?.publicly_queryable
			) || []
		);
	}, [ projectActive, taxonomies ] );
}
