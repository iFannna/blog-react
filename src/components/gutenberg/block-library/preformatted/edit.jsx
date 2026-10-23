import { __ } from '@/lib/gutenberg/i18n';
import { RichText, useBlockProps } from '@/components/gutenberg/block-editor';
import { createBlock, getDefaultBlockName } from '@/lib/gutenberg/blocks';

export default function PreformattedEdit( {
	attributes,
	mergeBlocks,
	setAttributes,
	onRemove,
	insertBlocksAfter,
	style,
} ) {
	const { content } = attributes;
	const blockProps = useBlockProps( { style } );

	return (
		<RichText
			tagName="pre"
			identifier="content"
			preserveWhiteSpace
			value={ content }
			onChange={ ( nextContent ) => {
				setAttributes( {
					content: nextContent,
				} );
			} }
			onRemove={ onRemove }
			aria-label={ __( 'Preformatted text' ) }
			placeholder={ __( 'Write preformatted text…' ) }
			onMerge={ mergeBlocks }
			{ ...blockProps }
			__unstablePastePlainText
			__unstableOnSplitAtDoubleLineEnd={
				insertBlocksAfter
					? () =>
							insertBlocksAfter(
								createBlock( getDefaultBlockName() )
							)
					: undefined
			}
		/>
	);
}
