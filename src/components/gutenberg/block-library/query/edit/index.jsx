import { useSelect } from '@/stores/gutenberg/data';
import { useState } from '@/lib/gutenberg/element';
import { store as blockEditorStore } from '@/components/gutenberg/block-editor';
import QueryContent from './query-content';
import QueryPlaceholder from './query-placeholder';
import { PatternSelectionModal } from './pattern-selection';

const QueryEdit = ( props ) => {
	const { clientId, attributes } = props;
	const [ isPatternSelectionModalOpen, setIsPatternSelectionModalOpen ] =
		useState( false );
	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlocks( clientId ).length,
		[ clientId ]
	);
	const Component = hasInnerBlocks ? QueryContent : QueryPlaceholder;

	return (
		<>
			<Component
				{ ...props }
				openPatternSelectionModal={ () =>
					setIsPatternSelectionModalOpen( true )
				}
			/>
			{ isPatternSelectionModalOpen && (
				<PatternSelectionModal
					clientId={ clientId }
					attributes={ attributes }
					setIsPatternSelectionModalOpen={
						setIsPatternSelectionModalOpen
					}
				/>
			) }
		</>
	);
};

export default QueryEdit;
