import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@/components/gutenberg/block-editor';
import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@/components/gutenberg/ui';
import { createBlock, getDefaultBlockName } from '@/lib/gutenberg/blocks';
import { __ } from '@/lib/gutenberg/i18n';
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

export default function ReadMore( {
	attributes: { content, linkTarget },
	setAttributes,
	insertBlocksAfter,
} ) {
	const blockProps = useBlockProps();
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => setAttributes( { linkTarget: '_self' } ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Open in new tab' ) }
						isShownByDefault
						hasValue={ () => linkTarget !== '_self' }
						onDeselect={ () =>
							setAttributes( { linkTarget: '_self' } )
						}
					>
						<ToggleControl
							label={ __( 'Open in new tab' ) }
							onChange={ ( value ) =>
								setAttributes( {
									linkTarget: value ? '_blank' : '_self',
								} )
							}
							checked={ linkTarget === '_blank' }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<RichText
				identifier="content"
				tagName="a"
				aria-label={ __( '“Read more” link text' ) }
				placeholder={ __( 'Read more' ) }
				value={ content }
				onChange={ ( newValue ) =>
					setAttributes( { content: newValue } )
				}
				__unstableOnSplitAtEnd={
					insertBlocksAfter
						? () =>
								insertBlocksAfter(
									createBlock( getDefaultBlockName() )
								)
						: undefined
				}
				withoutInteractiveFormatting
				{ ...blockProps }
			/>
		</>
	);
}
