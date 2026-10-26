import { useMemo } from '@/lib/gutenberg/element';
import { useSelect } from '@/stores/gutenberg/data';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import {
	filterProjectTerms,
	getProjectTermAdapter,
	isProjectTermSlug,
	useProjectTerms,
} from '@/services/gutenberg/project/terms';

const EMPTY_ARRAY = [];

/**
 * 读取术语列表：项目编辑器直连后端，示例页继续使用 core-data。
 *
 * @param {string} slug  Taxonomy slug.
 * @param {Object} query 与 WP REST 列表参数一致的查询条件。
 * @return {{records: Array, isResolving: boolean, hasResolved: boolean, total: number}} 列表状态。
 */
export function useTermRecords( slug, query = {} ) {
	const usesProject = !! getProjectTermAdapter() && isProjectTermSlug( slug );
	const project = useProjectTerms( usesProject ? slug : null );
	const queryKey = JSON.stringify( query );

	const core = useSelect(
		( select ) => {
			if ( usesProject ) {
				return null;
			}
			const {
				getEntityRecords,
				getEntityRecordsTotalItems,
				hasFinishedResolution,
				isResolving,
			} = select( coreStore );
			const args = [ 'taxonomy', slug, query ];
			return {
				records: getEntityRecords( ...args ) ?? EMPTY_ARRAY,
				total: getEntityRecordsTotalItems?.( ...args ) ?? 0,
				isResolving: isResolving( 'getEntityRecords', args ),
				hasResolved: hasFinishedResolution( 'getEntityRecords', args ),
			};
		},
		// query 由调用方内联创建，用序列化结果作为依赖
		[ slug, usesProject, queryKey ]
	);

	const { projectRecords, projectTotal } = useMemo( () => {
		if ( ! project ) {
			return { projectRecords: EMPTY_ARRAY, projectTotal: 0 };
		}
		const params = JSON.parse( queryKey );
		const filter = {
			include: params.include,
			exclude: params.exclude,
			search: params.search,
			parent: params.parent,
			hideEmpty: params.hide_empty,
			orderby: params.orderby,
			order: params.order,
		};
		const all = filterProjectTerms( project.terms, filter );
		return {
			projectRecords:
				typeof params.per_page === 'number' && params.per_page > 0
					? filterProjectTerms( project.terms, {
							...filter,
							perPage: params.per_page,
						} )
					: all,
			projectTotal: all.length,
		};
	}, [ project, queryKey ] );

	if ( project ) {
		return {
			records: projectRecords,
			total: projectTotal,
			isResolving: project.loading,
			hasResolved: project.loaded,
		};
	}

	return (
		core ?? {
			records: EMPTY_ARRAY,
			total: 0,
			isResolving: false,
			hasResolved: true,
		}
	);
}
