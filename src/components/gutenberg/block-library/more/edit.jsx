import { __ } from '@/lib/gutenberg/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
} from '@/components/gutenberg/ui';
import {
	InspectorControls,
	PlainText,
	useBlockProps,
} from '@/components/gutenberg/block-editor';
import { getDefaultBlockName, createBlock } from '@/lib/gutenberg/blocks';
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

const DEFAULT_TEXT = __( 'Read more' );

export default function MoreEdit( {
	attributes: { customText, noTeaser },
	insertBlocksAfter,
	setAttributes,
} ) {
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						setAttributes( {
							noTeaser: false,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Hide excerpt' ) }
						isShownByDefault
						hasValue={ () => noTeaser }
						onDeselect={ () =>
							setAttributes( { noTeaser: false } )
						}
					>
						<ToggleControl
							label={ __(
								'Hide the excerpt on the full content page'
							) }
							checked={ !! noTeaser }
							onChange={ () =>
								setAttributes( { noTeaser: ! noTeaser } )
							}
							help={ ( checked ) =>
								checked
									? __( 'The excerpt is hidden.' )
									: __( 'The excerpt is visible.' )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<PlainText
					__experimentalVersion={ 2 }
					tagName="span"
					aria-label={ __( '"Read more" text' ) }
					value={ customText }
					placeholder={ DEFAULT_TEXT }
					onChange={ ( value ) =>
						setAttributes( { customText: value } )
					}
					disableLineBreaks
					__unstableOnSplitAtEnd={
						insertBlocksAfter
							? () =>
									insertBlocksAfter(
										createBlock( getDefaultBlockName() )
									)
							: undefined
					}
				/>
			</div>
		</>
	);
}
