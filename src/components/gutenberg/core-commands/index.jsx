import { createRoot, StrictMode } from '@/lib/gutenberg/element';
import { privateApis as routerPrivateApis } from '@/lib/gutenberg/router';
import { CommandMenu } from '@/lib/gutenberg/commands';
import { useAdminNavigationCommands } from './admin-navigation-commands';
import { useSiteEditorNavigationCommands } from './site-editor-navigation-commands';
import { unlock } from './lock-unlock';


const { RouterProvider } = unlock( routerPrivateApis );

// Register core commands and render the Command Palette.
function CommandPalette( { settings } ) {
	const { menu_commands: menuCommands, is_network_admin: isNetworkAdmin } =
		settings;
	useAdminNavigationCommands( menuCommands );
	useSiteEditorNavigationCommands( isNetworkAdmin );
	return (
		<RouterProvider pathArg="p">
			<CommandMenu />
		</RouterProvider>
	);
}

/**
 * Initializes the Command Palette.
 *
 * @param {Object} settings Command palette settings.
 */
export function initializeCommandPalette( settings ) {
	const root = document.createElement( 'div' );
	document.body.appendChild( root );
	createRoot( root ).render(
		<StrictMode>
			<CommandPalette settings={ settings } />
		</StrictMode>
	);
}
