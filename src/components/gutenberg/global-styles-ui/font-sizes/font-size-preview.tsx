// @ts-expect-error: Not typed yet.
import { getComputedFluidTypographyValue } from '@/components/gutenberg/block-editor';
import { __ } from '@/lib/gutenberg/i18n';
import type { FontSize } from '@/lib/gutenberg/global-styles-engine';
import { useStyle } from '../hooks';

interface FontSizePreviewProps {
	fontSize: FontSize;
}

function FontSizePreview( { fontSize }: FontSizePreviewProps ) {
	const [ font ] = useStyle< { fontFamily?: string } >( 'typography' );

	const input =
		typeof fontSize?.fluid === 'object' &&
		fontSize?.fluid?.min &&
		fontSize?.fluid?.max
			? {
					minimumFontSize: fontSize.fluid.min,
					maximumFontSize: fontSize.fluid.max,
				}
			: {
					fontSize: fontSize.size,
				};

	const computedFontSize = getComputedFluidTypographyValue( input );
	return (
		<div
			className="global-styles-ui-typography-preview"
			style={ {
				fontSize: computedFontSize,
				fontFamily: font?.fontFamily ?? 'serif',
			} }
		>
			{ __( 'Aa' ) }
		</div>
	);
}

export default FontSizePreview;
