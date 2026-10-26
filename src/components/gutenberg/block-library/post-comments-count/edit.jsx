import { useBlockProps } from '@/components/gutenberg/block-editor';
import { useState, useEffect } from '@/lib/gutenberg/element';
import { useSelect } from '@/stores/gutenberg/data';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import apiFetch from '@/services/gutenberg/api-fetch';
import { isProjectContentSource } from '@/services/gutenberg/project/content';
import { addQueryArgs } from '@/utils/gutenberg/url';

export default function PostCommentsCountEdit( { context } ) {
	const { postId } = context;
	const [ commentsCount, setCommentsCount ] = useState();
	const projectActive = isProjectContentSource();
	const projectCount = useSelect(
		( select ) => {
			if ( ! projectActive || ! postId ) return undefined;
			return select( coreStore ).getEditedEntityRecord(
				'postType',
				'post',
				postId
			)?.comment_count;
		},
		[ projectActive, postId ]
	);

	const blockProps = useBlockProps();

	useEffect( () => {
		if ( projectActive || ! postId ) {
			return;
		}

		const currentPostId = postId;

		apiFetch( {
			path: addQueryArgs( '/wp/v2/comments', {
				post: postId,
			} ),
			parse: false,
		} ).then( ( res ) => {
			// Stale requests will have the `currentPostId` of an older closure.
			if ( currentPostId === postId ) {
				setCommentsCount( res.headers.get( 'X-WP-Total' ) );
			}
		} );
	}, [ postId, projectActive ] );

	const effectiveCount = projectActive
		? String( projectCount ?? 0 )
		: commentsCount;
	const hasPostAndComments = postId && effectiveCount !== undefined;

	const blockStyles = {
		...blockProps.style,
		textDecoration: hasPostAndComments
			? blockProps.style?.textDecoration
			: undefined,
	};

	return (
		<div { ...blockProps } style={ blockStyles }>
			{ hasPostAndComments ? effectiveCount : '0' }
		</div>
	);
}
