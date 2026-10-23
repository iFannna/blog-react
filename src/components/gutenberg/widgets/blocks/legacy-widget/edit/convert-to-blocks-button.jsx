import { useDispatch } from '@/stores/gutenberg/data';
import { store as blockEditorStore } from '@/components/gutenberg/block-editor';
import { ToolbarButton } from '@/components/gutenberg/ui';
import { createBlock, rawHandler } from '@/lib/gutenberg/blocks';
import { __ } from '@/lib/gutenberg/i18n';

export default function ConvertToBlocksButton( { clientId, rawInstance } ) {
	const { replaceBlocks } = useDispatch( blockEditorStore );

	return (
		<ToolbarButton
			onClick={ () => {
				if ( rawInstance.title ) {
					replaceBlocks( clientId, [
						createBlock( 'core/heading', {
							content: rawInstance.title,
						} ),
						...rawHandler( { HTML: rawInstance.text } ),
					] );
				} else {
					replaceBlocks(
						clientId,
						rawHandler( { HTML: rawInstance.text } )
					);
				}
			} }
		>
			{ __( 'Convert to blocks' ) }
		</ToolbarButton>
	);
}
