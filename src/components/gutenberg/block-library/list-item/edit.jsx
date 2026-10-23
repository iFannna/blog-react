import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
	store as blockEditorStore,
} from '@/components/gutenberg/block-editor';
import { isRTL, __ } from '@/lib/gutenberg/i18n';
import { ToolbarButton } from '@/components/gutenberg/ui';
import {
	formatOutdent,
	formatOutdentRTL,
	formatIndentRTL,
	formatIndent,
} from '@/components/gutenberg/icons';
import { useMergeRefs } from '@/hooks/gutenberg/compose';
import { useSelect, useRegistry } from '@/stores/gutenberg/data';
import { displayShortcut } from '@/utils/gutenberg/keycodes';
import { useEnter, useTab, useMultiSelectTab, useMerge } from './hooks';
import {
	indentListItems,
	outdentListItems,
	getIndentTarget,
	getOutdentTarget,
} from './utils';

export function IndentUI( { clientId } ) {
	const registry = useRegistry();
	const { canIndent, canOutdent } = useSelect(
		( select ) => {
			const storeSelect = select( blockEditorStore );
			return {
				canIndent: !! getIndentTarget( storeSelect, clientId ),
				canOutdent: !! getOutdentTarget( storeSelect, clientId ),
			};
		},
		[ clientId ]
	);

	return (
		<>
			<ToolbarButton
				icon={ isRTL() ? formatOutdentRTL : formatOutdent }
				title={ __( 'Outdent' ) }
				shortcut={ displayShortcut.shift( 'Tab' ) }
				description={ __( 'Outdent list item' ) }
				disabled={ ! canOutdent }
				onClick={ () => outdentListItems( registry ) }
			/>
			<ToolbarButton
				icon={ isRTL() ? formatIndentRTL : formatIndent }
				title={ __( 'Indent' ) }
				shortcut="Tab"
				description={ __( 'Indent list item' ) }
				disabled={ ! canIndent }
				onClick={ () => indentListItems( registry, clientId ) }
			/>
		</>
	);
}

export default function ListItemEdit( {
	attributes,
	setAttributes,
	clientId,
	mergeBlocks,
} ) {
	const { placeholder, content } = attributes;
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		renderAppender: false,
		__unstableDisableDropZone: true,
	} );
	const useEnterRef = useEnter( clientId );
	const useTabRef = useTab();
	const useMultiSelectTabRef = useMultiSelectTab( clientId );
	const onMerge = useMerge( clientId, mergeBlocks );
	return (
		<>
			<li { ...innerBlocksProps }>
				<RichText
					ref={ useMergeRefs( [
						useEnterRef,
						useTabRef,
						useMultiSelectTabRef,
					] ) }
					identifier="content"
					tagName="div"
					onChange={ ( nextContent ) =>
						setAttributes( { content: nextContent } )
					}
					value={ content }
					aria-label={ __( 'List text' ) }
					placeholder={ placeholder || __( 'List' ) }
					onMerge={ onMerge }
				/>
				{ innerBlocksProps.children }
			</li>
			<BlockControls group="block">
				<IndentUI clientId={ clientId } />
			</BlockControls>
		</>
	);
}
