import { useInnerBlocksProps, useBlockProps } from '@/components/gutenberg/block-editor';

export default function save( { attributes: { tagName: Tag = 'div' } } ) {
	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );
	return <Tag { ...innerBlocksProps } />;
}
