import { useBlockProps } from '@/components/gutenberg/block-editor';
import { useSelect } from '@/stores/gutenberg/data';
import { __ } from '@/lib/gutenberg/i18n';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import useDeprecatedTextAlign from '../utils/deprecated-text-align-attributes';

function PostAuthorBiographyEdit( props ) {
	useDeprecatedTextAlign( props );
	const {
		context: { postType, postId },
	} = props;
	const { authorDetails } = useSelect(
		( select ) => {
			const { getEditedEntityRecord, getUser } = select( coreStore );
			const _authorId = getEditedEntityRecord(
				'postType',
				postType,
				postId
			)?.author;

			return {
				authorDetails: _authorId ? getUser( _authorId ) : null,
			};
		},
		[ postType, postId ]
	);

	const blockProps = useBlockProps();

	const displayAuthorBiography =
		authorDetails?.description || __( 'Author Biography' );

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
