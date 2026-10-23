import {
	Placeholder,
	Button,
	Spinner as WCSpinner,
} from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { navigation, Icon } from '@/components/gutenberg/icons';
import { speak } from '@/utils/gutenberg/a11y';
import { useEffect } from '@/lib/gutenberg/element';
import { useEntityRecords } from '@/stores/gutenberg/core-data';
import PlaceholderPreview from './placeholder-preview';
import NavigationMenuSelector from '../navigation-menu-selector';

export default function NavigationPlaceholder( {
	isSelected,
	currentMenuId,
	clientId,
	canUserCreateNavigationMenus = false,
	isResolvingCanUserCreateNavigationMenus,
	onSelectNavigationMenu,
	onSelectClassicMenu,
	onCreateEmpty,
} ) {
	const { isResolving: isResolvingMenus, hasResolved: hasResolvedMenus } =
		useEntityRecords( 'root', 'menu', { per_page: -1, context: 'view' } );

	useEffect( () => {
		if ( ! isSelected ) {
			return;
		}

		if ( isResolvingMenus ) {
			speak( __( 'Loading navigation block setup options…' ) );
		}

		if ( hasResolvedMenus ) {
			speak( __( 'Navigation block setup options ready.' ) );
		}
	}, [ hasResolvedMenus, isResolvingMenus, isSelected ] );

	const isResolvingActions =
		isResolvingMenus && isResolvingCanUserCreateNavigationMenus;

	return (
		<>
			<Placeholder className="wp-block-navigation-placeholder">
				{
					// The <PlaceholderPreview> component is displayed conditionally via CSS depending on
					// whether the block is selected or not. This is achieved via CSS to avoid
					// component re-renders
				 }
				<PlaceholderPreview isVisible={ ! isSelected } />
				<div
					aria-hidden={ ! isSelected ? true : undefined }
					className="wp-block-navigation-placeholder__controls"
				>
					<div className="wp-block-navigation-placeholder__actions">
						<div className="wp-block-navigation-placeholder__actions__indicator">
							<Icon icon={ navigation } /> { __( 'Navigation' ) }
						</div>

						<hr />

						{ isResolvingActions && <WCSpinner /> }

						<NavigationMenuSelector
							currentMenuId={ currentMenuId }
							clientId={ clientId }
							onSelectNavigationMenu={ onSelectNavigationMenu }
							onSelectClassicMenu={ onSelectClassicMenu }
						/>

						<hr />

						{ canUserCreateNavigationMenus && (
							<Button
								__next40pxDefaultSize
								variant="tertiary"
								onClick={ onCreateEmpty }
							>
								{ __( 'Start empty' ) }
							</Button>
						) }
					</div>
				</div>
			</Placeholder>
		</>
	);
}
