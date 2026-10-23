import { __ } from '@/lib/gutenberg/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
} from '@/components/gutenberg/block-editor';
import { useSelect } from '@/stores/gutenberg/data';
import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@/components/gutenberg/ui';
import clsx from 'clsx';
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

export default function Edit( {
	attributes,
	clientId,
	setAttributes,
	isSelected: isSingleSelected,
} ) {
	const { openByDefault } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const { isSelected } = useSelect(
		( select ) => {
			if ( isSingleSelected || openByDefault ) {
				return { isSelected: true };
			}

			return {
				isSelected: select( blockEditorStore ).hasSelectedInnerBlock(
					clientId,
					true
				),
			};
		},
		[ clientId, isSingleSelected, openByDefault ]
	);

	const blockProps = useBlockProps( {
		className: clsx( {
			'is-open': openByDefault || isSelected,
		} ),
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: 'all',
		directInsert: true,
	} );

	return (
		<>
			<InspectorControls key="setting">
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						setAttributes( { openByDefault: false } );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Open by default' ) }
						isShownByDefault
						hasValue={ () => !! openByDefault }
						onDeselect={ () => {
							setAttributes( { openByDefault: false } );
						} }
					>
						<ToggleControl
							label={ __( 'Open by default' ) }
							onChange={ ( value ) => {
								setAttributes( {
									openByDefault: value,
								} );
							} }
							checked={ openByDefault }
							help={ __(
								'Accordion content will be displayed by default.'
							) }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
