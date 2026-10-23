import { useBlockProps } from '@/components/gutenberg/block-editor';
import { useState, useEffect } from '@/lib/gutenberg/element';
import apiFetch from '@/services/gutenberg/api-fetch';
import { addQueryArgs } from '@/utils/gutenberg/url';

export default function PostCommentsCountEdit( { context } ) {
	const { postId } = context;
	const [ commentsCount, setCommentsCount ] = useState();

	const blockProps = useBlockProps();

	useEffect( () => {
		if ( ! postId ) {
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
	}, [ postId ] );

	const hasPostAndComments = postId && commentsCount !== undefined;

	const blockStyles = {
		...blockProps.style,
		textDecoration: hasPostAndComments
			? blockProps.style?.textDecoration
			: undefined,
	};

	return (
		<div { ...blockProps } style={ blockStyles }>
			{ hasPostAndComments ? commentsCount : '0' }
		</div>
	);
}
