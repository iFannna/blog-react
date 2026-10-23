import { useBlockProps, useInnerBlocksProps } from '@/components/gutenberg/block-editor';

export default function save() {
	const blockProps = useBlockProps.save( {
		role: 'region',
	} );
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );
	return <div { ...innerBlocksProps } />;
}
