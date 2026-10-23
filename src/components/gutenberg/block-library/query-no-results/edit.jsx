import { useBlockProps, useInnerBlocksProps } from '@/components/gutenberg/block-editor';

export default function QueryNoResultsEdit() {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps );

	return <div { ...innerBlocksProps } />;
}
