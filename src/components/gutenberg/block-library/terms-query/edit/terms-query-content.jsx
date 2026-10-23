import { useCallback } from '@/lib/gutenberg/element';
import { useBlockProps, useInnerBlocksProps } from '@/components/gutenberg/block-editor';
import TermsQueryInspectorControls from './inspector-controls';

export default function TermsQueryContent( {
	attributes,
	setAttributes,
	clientId,
	context,
} ) {
	const { tagName: TagName } = attributes;
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {} );
	const setQuery = useCallback(
		( newQuery ) =>
			setAttributes( ( prevAttributes ) => ( {
				termQuery: { ...prevAttributes.termQuery, ...newQuery },
			} ) ),
		[ setAttributes ]
	);
	return (
		<>
			<TermsQueryInspectorControls
				attributes={ attributes }
				setQuery={ setQuery }
				setAttributes={ setAttributes }
				clientId={ clientId }
				templateSlug={ context?.templateSlug }
			/>
			<TagName { ...innerBlocksProps } />
		</>
	);
}
