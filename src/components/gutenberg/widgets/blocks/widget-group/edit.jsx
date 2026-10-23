import {
	useBlockProps,
	BlockIcon,
	ButtonBlockAppender,
	InnerBlocks,
	store as blockEditorStore,
	RichText,
} from '@/components/gutenberg/block-editor';
import { Placeholder } from '@/components/gutenberg/ui';
import { group as groupIcon } from '@/components/gutenberg/icons';
import { __ } from '@/lib/gutenberg/i18n';
import { useSelect } from '@/stores/gutenberg/data';

export default function Edit( props ) {
	const { clientId } = props;
	const hasInnerBlocks = useSelect(
		( select ) => select( blockEditorStore ).getBlockCount( clientId ) > 0,
		[ clientId ]
	);

	return (
		<div { ...useBlockProps( { className: 'widget' } ) }>
			{ ! hasInnerBlocks ? (
				<PlaceholderContent { ...props } />
			) : (
				<PreviewContent { ...props } />
			) }
		</div>
	);
}

function PlaceholderContent( { clientId } ) {
	return (
		<>
			<Placeholder
				className="wp-block-widget-group__placeholder"
				icon={ <BlockIcon icon={ groupIcon } /> }
				label={ __( 'Widget Group' ) }
			>
				<ButtonBlockAppender rootClientId={ clientId } />
			</Placeholder>
			<InnerBlocks renderAppender={ false } />
		</>
	);
}

function PreviewContent( { attributes, setAttributes } ) {
	return (
		<>
			<RichText
				tagName="h2"
				identifier="title"
				className="widget-title"
				allowedFormats={ [] }
				placeholder={ __( 'Title' ) }
				value={ attributes.title ?? '' }
				onChange={ ( title ) => setAttributes( { title } ) }
			/>
			<InnerBlocks />
		</>
	);
}
