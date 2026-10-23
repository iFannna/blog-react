import { InspectorControls, useBlockProps } from '@/components/gutenberg/block-editor';
import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';
import useDeprecatedTextAlign from '../utils/deprecated-text-align-attributes';

export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { linkTarget } = attributes;
	useDeprecatedTextAlign( props );
	const blockProps = useBlockProps();

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const inspectorControls = (
		<InspectorControls>
			<ToolsPanel
				label={ __( 'Settings' ) }
				resetAll={ () => {
					setAttributes( {
						linkTarget: '_self',
					} );
				} }
				dropdownMenuProps={ dropdownMenuProps }
			>
				<ToolsPanelItem
					label={ __( 'Open in new tab' ) }
					isShownByDefault
					hasValue={ () => linkTarget === '_blank' }
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
	);

	return (
		<>
			{ inspectorControls }
			<div { ...blockProps }>
				<a
					href="#edit-comment-pseudo-link"
					onClick={ ( event ) => event.preventDefault() }
				>
					{ __( 'Edit' ) }
				</a>
			</div>
		</>
	);
}
