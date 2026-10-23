import { useBlockProps } from '@/components/gutenberg/block-editor';
import { useInstanceId } from '@/hooks/gutenberg/compose';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import { VisuallyHidden } from '@/components/gutenberg/design-system';
import CommentsForm from './form';

export default function PostCommentsFormEdit( { context } ) {
	const { postId, postType } = context;

	const instanceId = useInstanceId( PostCommentsFormEdit );
	const instanceIdDesc = sprintf( 'comments-form-edit-%d-desc', instanceId );

	const blockProps = useBlockProps( {
		'aria-describedby': instanceIdDesc,
	} );

	return (
		<div { ...blockProps }>
			<CommentsForm postId={ postId } postType={ postType } />
			<VisuallyHidden id={ instanceIdDesc }>
				{ __( 'Comments form disabled in editor.' ) }
			</VisuallyHidden>
		</div>
	);
}
