import clsx from 'clsx';
import { useBlockProps, useInnerBlocksProps } from '@/components/gutenberg/block-editor';

export default function save( { attributes, className } ) {
	const { fontSize, style } = attributes;
	const blockProps = useBlockProps.save( {
		className: clsx( className, {
			'has-custom-font-size': fontSize || style?.typography?.fontSize,
		} ),
	} );
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );
	return <div { ...innerBlocksProps } />;
}
