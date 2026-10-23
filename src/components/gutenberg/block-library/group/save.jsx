import { useInnerBlocksProps, useBlockProps } from '@/components/gutenberg/block-editor';

export default function save( { attributes: { tagName: Tag } } ) {
	return <Tag { ...useInnerBlocksProps.save( useBlockProps.save() ) } />;
}
