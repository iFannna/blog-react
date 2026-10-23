import { __ } from '@/lib/gutenberg/i18n';
import { DropdownMenu, ToolbarGroup, ToolbarItem } from '@/components/gutenberg/ui';
import BlockStylesMenu from '../block-switcher/block-styles-menu';

export default function BlockStylesDropdown( {
	clientIds,
	children,
	label,
	text,
} ) {
	return (
		<ToolbarGroup>
			<ToolbarItem>
				{ ( toggleProps ) => (
					<DropdownMenu
						className="block-editor-block-switcher"
						label={ label }
						popoverProps={ {
							placement: 'bottom-start',
							className: 'block-editor-block-switcher__popover',
						} }
						icon={ children }
						text={ text }
						toggleProps={ {
							description: __( 'Change block style' ),
							...toggleProps,
						} }
						menuProps={ { orientation: 'both' } }
					>
						{ ( { onClose } ) => (
							<div className="block-editor-block-switcher__container">
								<BlockStylesMenu
									hoveredBlock={ {
										clientId: clientIds[ 0 ],
									} }
									onSwitch={ onClose }
								/>
							</div>
						) }
					</DropdownMenu>
				) }
			</ToolbarItem>
		</ToolbarGroup>
	);
}
