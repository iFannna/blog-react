import { store as blockEditorStore } from '@/components/gutenberg/block-editor';
import { useSelect } from '@/stores/gutenberg/data';
import { __ } from '@/lib/gutenberg/i18n';
import RevisionDiffPanel from '../revision-diff-panel';

/**
 * Panel that shows changed block attributes for the selected block
 * when viewing revisions.
 */
export default function RevisionBlockDiffPanel() {
	const { block } = useSelect( ( select ) => {
		const { getSelectedBlock } = select( blockEditorStore );
		return {
			block: getSelectedBlock(),
		};
	}, [] );

	if ( ! block ) {
		return null;
	}

	const changedAttributes =
		block.attributes?.__revisionDiffStatus?.changedAttributes;

	return (
		<RevisionDiffPanel
			title={ __( 'Changed attributes' ) }
			entries={ changedAttributes }
			initialOpen
		/>
	);
}
