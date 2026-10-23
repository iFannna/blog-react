import { useBlockProps, useInnerBlocksProps } from '@/components/gutenberg/block-editor';

export default function save() {
	const blockProps = useBlockProps.save( {
		role: 'tabpanel',
		tabIndex: 0,
	} );
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <section { ...innerBlocksProps } />;
}
