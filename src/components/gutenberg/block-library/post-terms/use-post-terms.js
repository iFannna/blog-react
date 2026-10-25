import { store as coreStore } from '@/stores/gutenberg/core-data';
import { useSelect } from '@/stores/gutenberg/data';
import { store as editorStore } from '@/components/gutenberg/editor/store';
import {
	getProjectTermAdapter,
	isProjectTermSlug,
	useProjectTerms,
} from '@/services/gutenberg/project/terms';

const EMPTY_ARRAY = [];

export default function usePostTerms( { postId, term } ) {
	const { slug } = term;
	const usesProject = !! getProjectTermAdapter() && isProjectTermSlug( slug );
	const projectTerms = useProjectTerms( usesProject ? slug : null );

	const assignedIds = useSelect(
		( select ) => {
			if ( ! usesProject ) {
				return EMPTY_ARRAY;
			}
			const editor = select( editorStore );
			// 查询循环里的其他文章暂未接入后端，只有当前文章能取到术语
			if ( editor.getCurrentPostId() !== postId ) {
				return EMPTY_ARRAY;
			}
			return editor.getEditedPostAttribute( term.rest_base ) ?? EMPTY_ARRAY;
		},
		[ usesProject, postId, term.rest_base ]
	);

	const core = useSelect(
		( select ) => {
			const visible = term?.visibility?.publicly_queryable;
			if ( usesProject || ! visible || ! postId ) {
				return {
					postTerms: EMPTY_ARRAY,
					isLoading: false,
					hasPostTerms: false,
				};
			}

			const { getEntityRecords, isResolving } = select( coreStore );
			const taxonomyArgs = [
				'taxonomy',
				slug,
				{
					post: postId,
					per_page: -1,
					context: 'view',
				},
			];
			const terms = getEntityRecords( ...taxonomyArgs );

			return {
				postTerms: terms,
				isLoading: isResolving( 'getEntityRecords', taxonomyArgs ),
				hasPostTerms: !! terms?.length,
			};
		},
		[ postId, term?.visibility?.publicly_queryable, slug, usesProject ]
	);

	if ( projectTerms ) {
		const ids = new Set( assignedIds );
		const postTerms = projectTerms.terms.filter( ( item ) =>
			ids.has( item.id )
		);
		return {
			postTerms,
			isLoading: projectTerms.loading,
			hasPostTerms: postTerms.length > 0,
		};
	}

	return core;
}
