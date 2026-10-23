import {
	InspectorControls,
	useBlockProps,
	useBlockDisplayInformation,
	RichText,
} from '@/components/gutenberg/block-editor';
import { createBlock, getDefaultBlockName } from '@/lib/gutenberg/blocks';
import { Spinner as WCSpinner, TextControl } from '@/components/gutenberg/ui';
import { useSelect } from '@/stores/gutenberg/data';
import { decodeEntities } from '@/utils/gutenberg/html-entities';
import { __ } from '@/lib/gutenberg/i18n';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import usePostTerms from './use-post-terms';

// Allowed formats for the prefix and suffix fields.
const ALLOWED_FORMATS = [
	'core/bold',
	'core/image',
	'core/italic',
	'core/link',
	'core/strikethrough',
	'core/text-color',
];

export default function PostTermsEdit( {
	attributes,
	clientId,
	context,
	isSelected,
	setAttributes,
	insertBlocksAfter,
} ) {
	const { term, separator, prefix, suffix } = attributes;
	const { postId, postType } = context;

	const selectedTerm = useSelect(
		( select ) => {
			if ( ! term ) {
				return {};
			}
			const { getTaxonomy } = select( coreStore );
			const taxonomy = getTaxonomy( term );
			return taxonomy?.visibility?.publicly_queryable ? taxonomy : {};
		},
		[ term ]
	);
	const { postTerms, hasPostTerms, isLoading } = usePostTerms( {
		postId,
		term: selectedTerm,
	} );
	const hasPost = postId && postType;
	const blockInformation = useBlockDisplayInformation( clientId );
	const blockProps = useBlockProps( {
		className: term && `taxonomy-${ term }`,
	} );

	return (
		<>
			<InspectorControls group="advanced">
				<TextControl
					autoComplete="off"
					label={ __( 'Separator' ) }
					value={ separator || '' }
					onChange={ ( nextValue ) => {
						setAttributes( { separator: nextValue } );
					} }
					help={ __( 'Enter character(s) used to separate terms.' ) }
				/>
			</InspectorControls>
			<div { ...blockProps }>
				{ isLoading && hasPost && <WCSpinner /> }
				{ ! isLoading && ( isSelected || prefix ) && (
					<RichText
						identifier="prefix"
						allowedFormats={ ALLOWED_FORMATS }
						className="wp-block-post-terms__prefix"
						aria-label={ __( 'Prefix' ) }
						placeholder={ __( 'Prefix' ) + ' ' }
						value={ prefix }
						onChange={ ( value ) =>
							setAttributes( { prefix: value } )
						}
						tagName="span"
					/>
				) }
				{ ( ! hasPost || ! term ) && (
					<span>{ blockInformation.title }</span>
				) }
				{ hasPost &&
					! isLoading &&
					hasPostTerms &&
					postTerms
						.map( ( postTerm ) => (
							<a
								key={ postTerm.id }
								href={ postTerm.link }
								onClick={ ( event ) => event.preventDefault() }
								rel="tag"
							>
								{ decodeEntities( postTerm.name ) }
							</a>
						) )
						.reduce( ( prev, curr ) => (
							<>
								{ prev }
								<span className="wp-block-post-terms__separator">
									{ separator || ' ' }
								</span>
								{ curr }
							</>
						) ) }
				{ hasPost &&
					! isLoading &&
					! hasPostTerms &&
					( selectedTerm?.labels?.no_terms ||
						__( 'Term items not found.' ) ) }
				{ ! isLoading && ( isSelected || suffix ) && (
					<RichText
						identifier="suffix"
						allowedFormats={ ALLOWED_FORMATS }
						className="wp-block-post-terms__suffix"
						aria-label={ __( 'Suffix' ) }
						placeholder={ ' ' + __( 'Suffix' ) }
						value={ suffix }
						onChange={ ( value ) =>
							setAttributes( { suffix: value } )
						}
						tagName="span"
						__unstableOnSplitAtEnd={
							insertBlocksAfter
								? () =>
										insertBlocksAfter(
											createBlock( getDefaultBlockName() )
										)
								: undefined
						}
					/>
				) }
			</div>
		</>
	);
}
