import { __experimentalItemGroup as ItemGroup } from '@/components/gutenberg/ui';
import {
	background,
	blockDefault,
	typography,
	color,
	layout,
	shadow as shadowIcon,
} from '@/components/gutenberg/icons';
import { __ } from '@/lib/gutenberg/i18n';
import { privateApis as blockEditorPrivateApis } from '@/components/gutenberg/block-editor';
import type { GlobalStylesSettings } from '@/lib/gutenberg/global-styles-engine';
import { NavigationButtonAsItem } from './navigation-button';
import { useSetting } from './hooks';
import { unlock } from './lock-unlock';

const {
	useHasDimensionsPanel,
	useHasTypographyPanel,
	useHasColorPanel,
	useSettingsForBlockElement,
	useHasBackgroundPanel,
} = unlock( blockEditorPrivateApis );

function RootMenu() {
	// Get the raw settings from our custom hook
	const [ rawSettings ] = useSetting< GlobalStylesSettings >( '' );

	// Process settings the same way as Gutenberg
	const settings = useSettingsForBlockElement( rawSettings );

	// Use the same panel detection logic as Gutenberg
	const hasBackgroundPanel = useHasBackgroundPanel( rawSettings );
	const hasTypographyPanel = useHasTypographyPanel( settings );
	const hasColorPanel = useHasColorPanel( settings );
	const hasShadowPanel = true; // Same as Gutenberg
	const hasDimensionsPanel = useHasDimensionsPanel( settings );
	const hasLayoutPanel = hasDimensionsPanel;

	return (
		<>
			<ItemGroup>
				{ hasTypographyPanel && (
					<NavigationButtonAsItem
						icon={ typography }
						path="/typography"
					>
						{ __( 'Typography' ) }
					</NavigationButtonAsItem>
				) }
				{ hasColorPanel && (
					<NavigationButtonAsItem icon={ color } path="/colors">
						{ __( 'Colors' ) }
					</NavigationButtonAsItem>
				) }
				{ hasBackgroundPanel && (
					<NavigationButtonAsItem
						icon={ background }
						path="/background"
						aria-label={ __( 'Background styles' ) }
					>
						{ __( 'Background' ) }
					</NavigationButtonAsItem>
				) }
				{ hasShadowPanel && (
					<NavigationButtonAsItem icon={ shadowIcon } path="/shadows">
						{ __( 'Shadows' ) }
					</NavigationButtonAsItem>
				) }
				{ hasLayoutPanel && (
					<NavigationButtonAsItem icon={ layout } path="/layout">
						{ __( 'Layout' ) }
					</NavigationButtonAsItem>
				) }
				<NavigationButtonAsItem icon={ blockDefault } path="/blocks">
					{ __( 'Blocks & Elements' ) }
				</NavigationButtonAsItem>
			</ItemGroup>
		</>
	);
}

export default RootMenu;
