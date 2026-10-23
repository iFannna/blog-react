import { useBlockProps, useInnerBlocksProps } from '@/components/gutenberg/block-editor';

export default function save() {
	const blockProps = useBlockProps.save( {
		role: 'group',
	} );
	return <div { ...useInnerBlocksProps.save( blockProps ) } />;
}
