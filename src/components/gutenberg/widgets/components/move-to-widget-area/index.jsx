import {
	DropdownMenu,
	MenuGroup,
	MenuItemsChoice,
	ToolbarGroup,
	ToolbarItem,
} from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { moveTo } from '@/components/gutenberg/icons';

export default function MoveToWidgetArea( {
	currentWidgetAreaId,
	widgetAreas,
	onSelect,
} ) {
	return (
		<ToolbarGroup>
			<ToolbarItem>
				{ ( toggleProps ) => (
					<DropdownMenu
						icon={ moveTo }
						label={ __( 'Move to widget area' ) }
						toggleProps={ toggleProps }
					>
						{ ( { onClose } ) => (
							<MenuGroup label={ __( 'Move to' ) }>
								<MenuItemsChoice
									choices={ widgetAreas.map(
										( widgetArea ) => ( {
											value: widgetArea.id,
											label: widgetArea.name,
											info: widgetArea.description,
										} )
									) }
									value={ currentWidgetAreaId }
									onSelect={ ( value ) => {
										onSelect( value );
										onClose();
									} }
								/>
							</MenuGroup>
						) }
					</DropdownMenu>
				) }
			</ToolbarItem>
		</ToolbarGroup>
	);
}
