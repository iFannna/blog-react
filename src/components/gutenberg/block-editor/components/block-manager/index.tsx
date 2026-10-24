import { store as blocksStore } from '@/lib/gutenberg/blocks';
import { useSelect } from '@/stores/gutenberg/data';
import {
	SearchControl,
	CheckboxControl as WCCheckboxControl,
	__experimentalVStack as VStack,
} from '@/components/gutenberg/ui';
import { __, _n, sprintf } from '@/lib/gutenberg/i18n';
import { useEffect, useState } from '@/lib/gutenberg/element';
import { useDebounce } from '@/hooks/gutenberg/compose';
import { speak } from '@/utils/gutenberg/a11y';
import BlockManagerCategory from './category';
import type { BlockManagerProps } from './types';

/**
 * Provides a list of blocks with checkboxes.
 *
 * @param props                    Props.
 * @param props.blockTypes         An array of blocks.
 * @param props.selectedBlockTypes An array of selected blocks.
 * @param props.onChange           Function to be called when the selected blocks change.
 * @param props.showSelectAll      Whether to show the select all checkbox.
 */
export default function BlockManager( {
	blockTypes,
	selectedBlockTypes,
	onChange,
	showSelectAll = true,
}: BlockManagerProps ) {
	const debouncedSpeak = useDebounce( speak, 500 );
	const [ search, setSearch ] = useState( '' );
	const { categories, isMatchingSearchTerm } = useSelect( ( select ) => {
		return {
			categories: select( blocksStore ).getCategories(),
			isMatchingSearchTerm: select( blocksStore ).isMatchingSearchTerm,
		};
	}, [] );

	const filteredBlockTypes = blockTypes.filter( ( blockType ) => {
		return ! search || isMatchingSearchTerm( blockType, search );
	} );

	const isIndeterminate =
		selectedBlockTypes.length > 0 &&
		selectedBlockTypes.length !== blockTypes.length;

	const isAllChecked =
		blockTypes.length > 0 &&
		selectedBlockTypes.length === blockTypes.length;

	// Announce search results on change
	useEffect( () => {
		if ( ! search ) {
			return;
		}
		const count = filteredBlockTypes.length;
		const resultsFoundMessage = sprintf(
			/* translators: %d: number of results. */
			_n( '%d result found.', '%d results found.', count ),
			count
		);
		debouncedSpeak( resultsFoundMessage );
	}, [ filteredBlockTypes?.length, search, debouncedSpeak ] );

	return (
		<VStack className="block-editor-block-manager__content" spacing={ 4 }>
			<SearchControl
				label={ __( 'Search for a block' ) }
				placeholder={ __( 'Search for a block' ) }
				value={ search }
				onChange={ ( nextSearch ) => setSearch( nextSearch ) }
				className="block-editor-block-manager__search"
			/>
			{ showSelectAll && (
				<WCCheckboxControl
					className="block-editor-block-manager__select-all"
					label={ __( 'Select all' ) }
					checked={ isAllChecked }
					onChange={ () => {
						if ( isAllChecked ) {
							onChange( [] );
						} else {
							onChange( blockTypes );
						}
					} }
					indeterminate={ isIndeterminate }
				/>
			) }
			<div
				// The attribute takes the string as given.
				tabIndex={ '0' as unknown as number }
				role="region"
				aria-label={ __( 'Available block types' ) }
				className="block-editor-block-manager__results"
			>
				{ filteredBlockTypes.length === 0 && (
					<p className="block-editor-block-manager__no-results">
						{ __( 'No blocks found.' ) }
					</p>
				) }
				{ categories.map( ( category ) => (
					<BlockManagerCategory
						key={ category.slug }
						title={ __( category.title ) }
						blockTypes={ filteredBlockTypes.filter(
							( blockType ) =>
								blockType.category === category.slug
						) }
						selectedBlockTypes={ selectedBlockTypes }
						onChange={ onChange }
					/>
				) ) }
				<BlockManagerCategory
					title={ __( 'Uncategorized' ) }
					blockTypes={ filteredBlockTypes.filter(
						( { category } ) => ! category
					) }
					selectedBlockTypes={ selectedBlockTypes }
					onChange={ onChange }
				/>
			</div>
		</VStack>
	);
}
