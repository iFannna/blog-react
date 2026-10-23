import { __, _x } from '@/lib/gutenberg/i18n';
import { Placeholder, TextControl, Button } from '@/components/gutenberg/ui';
import { useState } from '@/lib/gutenberg/element';
import { blockDefault } from '@/components/gutenberg/icons';
import { useBlockProps, useInnerBlocksProps } from '@/components/gutenberg/block-editor';

export default function Edit( { attributes: { commentId }, setAttributes } ) {
	const [ commentIdInput, setCommentIdInput ] = useState( commentId );
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps );

	if ( ! commentId ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon={ blockDefault }
					label={ _x( 'Post Comment', 'block title' ) }
					instructions={ __(
						'To show a comment, input the comment ID.'
					) }
				>
					<TextControl
						value={ commentId }
						onChange={ ( val ) =>
							setCommentIdInput( parseInt( val ) )
						}
					/>

					<Button
						__next40pxDefaultSize
						variant="primary"
						onClick={ () => {
							setAttributes( { commentId: commentIdInput } );
						} }
					>
						{ __( 'Save' ) }
					</Button>
				</Placeholder>
			</div>
		);
	}

	return <div { ...innerBlocksProps } />;
}
