import { __ } from '@/lib/gutenberg/i18n';
import { PanelBody, SelectControl as WCSelectControl } from '@/components/gutenberg/ui';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@/components/gutenberg/block-editor';
import { createBlock, getDefaultBlockName } from '@/lib/gutenberg/blocks';
import { CODE_LANGUAGE_OPTIONS } from '@/lib/code-languages';

export default function CodeEdit( {
	attributes,
	setAttributes,
	onRemove,
	insertBlocksAfter,
	mergeBlocks,
} ) {
	const blockProps = useBlockProps();
	// 在渲染期翻译，避免模块早于语言包求值
	const languageOptions = CODE_LANGUAGE_OPTIONS.map( ( option ) =>
		option.value === ''
			? { ...option, label: __( 'Plain text' ) }
			: option
	);
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Code settings' ) }>
					<WCSelectControl
						label={ __( 'Language' ) }
						value={ attributes.language || '' }
						options={ languageOptions }
						onChange={ ( language ) =>
							setAttributes( { language } )
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<pre { ...blockProps }>
				<RichText
					tagName="code"
					identifier="content"
					value={ attributes.content }
					onChange={ ( content ) => setAttributes( { content } ) }
					onRemove={ onRemove }
					onMerge={ mergeBlocks }
					placeholder={ __( 'Write code…' ) }
					aria-label={ __( 'Code' ) }
					preserveWhiteSpace
					__unstablePastePlainText
					__unstableOnSplitAtDoubleLineEnd={
						insertBlocksAfter
							? () =>
									insertBlocksAfter(
										createBlock( getDefaultBlockName() )
									)
							: undefined
					}
					style={ { whiteSpace: 'break-spaces' } }
				/>
			</pre>
		</>
	);
}
