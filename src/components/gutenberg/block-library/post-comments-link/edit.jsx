import { useBlockProps } from '@/components/gutenberg/block-editor';
import { useState, useEffect } from '@/lib/gutenberg/element';
import { useSelect } from '@/stores/gutenberg/data';
import apiFetch from '@/services/gutenberg/api-fetch';
import { isProjectContentSource } from '@/services/gutenberg/project/content';
import { addQueryArgs } from '@/utils/gutenberg/url';
import { __, sprintf, _n } from '@/lib/gutenberg/i18n';
import { store as coreStore } from '@/stores/gutenberg/core-data';

function PostCommentsLinkEdit( { context } ) {
	const { postType, postId } = context;
	const [ commentsCount, setCommentsCount ] = useState();
	const projectActive = isProjectContentSource();

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

	const post = useSelect(
		( select ) =>
			select( coreStore ).getEditedEntityRecord(
				'postType',
				postType,
				postId
			),
		[ postType, postId ]
	);

	const effectiveCount = projectActive
		? String( post?.comment_count ?? 0 )
		: commentsCount;

	let commentsText;
	if ( effectiveCount !== undefined ) {
		const commentsNumber = parseInt( effectiveCount );

		if ( commentsNumber === 0 ) {
			commentsText = __( 'No comments' );
		} else {
			commentsText = sprintf(
				/* translators: %s: Number of comments */
				_n( '%s comment', '%s comments', commentsNumber ),
				commentsNumber.toLocaleString()
			);
		}
	}

	return (
		<div { ...blockProps }>
			{ post?.link && commentsText !== undefined ? (
				<a
					href={ post?.link + '#comments' }
					onClick={ ( event ) => event.preventDefault() }
				>
					{ commentsText }
				</a>
			) : (
				<a
					href="#post-comments-link-pseudo-link"
					onClick={ ( event ) => event.preventDefault() }
				>
					{ __( 'No comments' ) }
				</a>
			) }
		</div>
	);
}

export default PostCommentsLinkEdit;
