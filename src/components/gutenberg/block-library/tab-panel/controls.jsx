import {
	InspectorControls,
	store as blockEditorStore,
} from '@/components/gutenberg/block-editor';
import {
	CheckboxControl as WCCheckboxControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { useDispatch } from '@/stores/gutenberg/data';
import TabToolbarControls from '../tabs/tab-toolbar-controls';
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

export default function Controls( { tabsClientId, blockIndex, isDefaultTab } ) {
	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<TabToolbarControls tabsClientId={ tabsClientId } />
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						updateBlockAttributes( tabsClientId, {
							activeTabIndex: 0,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Default tab' ) }
						hasValue={ () => isDefaultTab && blockIndex !== 0 }
						onDeselect={ () => {
							updateBlockAttributes( tabsClientId, {
								activeTabIndex: 0,
							} );
						} }
						isShownByDefault
					>
						<WCCheckboxControl
							label={ __( 'Default tab' ) }
							checked={ isDefaultTab }
							onChange={ ( value ) => {
								updateBlockAttributes( tabsClientId, {
									activeTabIndex: value ? blockIndex : 0,
								} );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
		</>
	);
}
