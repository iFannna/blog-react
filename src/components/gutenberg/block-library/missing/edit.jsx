import { __, sprintf } from '@/lib/gutenberg/i18n';
import { RawHTML } from '@/lib/gutenberg/element';
import { Button } from '@/components/gutenberg/ui';
import { createBlock } from '@/lib/gutenberg/blocks';
import { useDispatch, useSelect } from '@/stores/gutenberg/data';
import {
	Warning,
	useBlockProps,
	store as blockEditorStore,
} from '@/components/gutenberg/block-editor';
import { safeHTML } from '@/utils/gutenberg/dom';

export default function MissingEdit( { attributes, clientId } ) {
	const { originalName, originalUndelimitedContent } = attributes;
	const hasContent = !! originalUndelimitedContent;
	const { hasFreeformBlock, hasHTMLBlock } = useSelect(
		( select ) => {
			const { canInsertBlockType, getBlockRootClientId } =
				select( blockEditorStore );

			return {
				hasFreeformBlock: canInsertBlockType(
					'core/freeform',
					getBlockRootClientId( clientId )
				),
				hasHTMLBlock: canInsertBlockType(
					'core/html',
					getBlockRootClientId( clientId )
				),
			};
		},
		[ clientId ]
	);
	const { replaceBlock } = useDispatch( blockEditorStore );

	function convertToHTML() {
		replaceBlock(
			clientId,
			createBlock( 'core/html', {}, [], [ originalUndelimitedContent ] )
		);
	}

	const actions = [];
	let messageHTML;

	const convertToHtmlButton = (
		<Button
			__next40pxDefaultSize
			key="convert"
			onClick={ convertToHTML }
			variant="primary"
		>
			{ __( 'Keep as HTML' ) }
		</Button>
	);

	if (
		hasContent &&
		! hasFreeformBlock &&
		( ! originalName || originalName === 'core/freeform' )
	) {
		if ( hasHTMLBlock ) {
			messageHTML = __(
				'It appears you are trying to use the deprecated Classic block. You can leave this block intact, convert its content to a Custom HTML block, or remove it entirely. Alternatively, if you have unsaved changes, you can save them and refresh to use the Classic block.'
			);
			actions.push( convertToHtmlButton );
		} else {
			messageHTML = __(
				'It appears you are trying to use the deprecated Classic block. You can leave this block intact, or remove it entirely. Alternatively, if you have unsaved changes, you can save them and refresh to use the Classic block.'
			);
		}
	} else if ( hasContent && hasHTMLBlock ) {
		messageHTML = sprintf(
			/* translators: %s: block name */
			__(
				'Your site doesn’t include support for the "%s" block. You can leave it as-is, convert it to custom HTML, or remove it.'
			),
			originalName
		);
		actions.push( convertToHtmlButton );
	} else {
		messageHTML = sprintf(
			/* translators: %s: block name */
			__(
				'Your site doesn’t include support for the "%s" block. You can leave it as-is or remove it.'
			),
			originalName
		);
	}

	return (
		<div { ...useBlockProps( { className: 'has-warning' } ) }>
			<Warning actions={ actions }>{ messageHTML }</Warning>
			<RawHTML>{ safeHTML( originalUndelimitedContent ) }</RawHTML>
		</div>
	);
}
