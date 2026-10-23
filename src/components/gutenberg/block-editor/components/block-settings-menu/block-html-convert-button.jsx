import { __ } from '@/lib/gutenberg/i18n';
import { MenuItem } from '@/components/gutenberg/ui';
import { rawHandler, getBlockContent } from '@/lib/gutenberg/blocks';
import { useDispatch, useSelect } from '@/stores/gutenberg/data';
import { store as blockEditorStore } from '../../store';

function BlockHTMLConvertButton( { clientId } ) {
	const block = useSelect(
		( select ) => select( blockEditorStore ).getBlock( clientId ),
		[ clientId ]
	);
	const { replaceBlocks } = useDispatch( blockEditorStore );

	if ( ! block || block.name !== 'core/html' ) {
		return null;
	}

	return (
		<MenuItem
			onClick={ () =>
				replaceBlocks(
					clientId,
					rawHandler( { HTML: getBlockContent( block ) } )
				)
			}
		>
			{ __( 'Convert to Blocks' ) }
		</MenuItem>
	);
}

export default BlockHTMLConvertButton;
