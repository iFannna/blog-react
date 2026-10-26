import { useBlockProps } from '@/components/gutenberg/block-editor';
import { useSelect } from '@/stores/gutenberg/data';
import { __ } from '@/lib/gutenberg/i18n';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { isProjectContentSource } from '@/services/gutenberg/project/content';
import useDeprecatedTextAlign from '../utils/deprecated-text-align-attributes';

function PostAuthorBiographyEdit( props ) {
	useDeprecatedTextAlign( props );
	const {
		context: { postType, postId },
	} = props;
	const projectActive = isProjectContentSource();
	const { authorDetails, projectAuthor } = useSelect(
		( select ) => {
			const { getEditedEntityRecord, getUser } = select( coreStore );
			const currentPost = getEditedEntityRecord(
				'postType',
				postType,
				postId
			);
			if ( projectActive ) {
				return {
					authorDetails: null,
					projectAuthor: currentPost?._project ?? null,
				};
			}
			const _authorId = currentPost?.author;

			return {
				authorDetails: _authorId ? getUser( _authorId ) : null,
				projectAuthor: null,
			};
		},
		[ postType, postId, projectActive ]
	);

	const blockProps = useBlockProps();

	const displayAuthorBiography = projectActive
		? projectAuthor?.authorDescription || __( 'Author Biography' )
		: authorDetails?.description || __( 'Author Biography' );

	return (
		<>
			<div
				{ ...blockProps }
				dangerouslySetInnerHTML={ { __html: displayAuthorBiography } }
			/>
		</>
	);
}

export default PostAuthorBiographyEdit;
