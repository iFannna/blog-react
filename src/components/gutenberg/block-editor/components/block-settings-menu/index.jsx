import { ToolbarGroup, ToolbarItem } from '@/components/gutenberg/ui';
import BlockSettingsDropdown from './block-settings-dropdown';

export function BlockSettingsMenu( { clientIds, ...props } ) {
	return (
		<ToolbarGroup>
			<ToolbarItem>
				{ ( toggleProps ) => (
					<BlockSettingsDropdown
						clientIds={ clientIds }
						toggleProps={
							clientIds.length
								? toggleProps
								: {
										...toggleProps,
										disabled: true,
										accessibleWhenDisabled: true,
									}
						}
						{ ...props }
					/>
				) }
			</ToolbarItem>
		</ToolbarGroup>
	);
}

export default BlockSettingsMenu;
