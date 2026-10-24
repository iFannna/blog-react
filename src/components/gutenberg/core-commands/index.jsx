import { createRoot, StrictMode } from '@/lib/gutenberg/element';
import { privateApis as routerPrivateApis } from '@/lib/gutenberg/router';
import { CommandMenu } from '@/lib/gutenberg/commands';
import { unlock } from './lock-unlock';

const { RouterProvider } = unlock( routerPrivateApis );

function CommandPalette() {
	return (
		<RouterProvider pathArg="p">
			<CommandMenu />
		</RouterProvider>
	);
}

/**
 * Initializes the Command Palette.
 */
export function initializeCommandPalette() {
	const root = document.createElement( 'div' );
	document.body.appendChild( root );
	createRoot( root ).render(
		<StrictMode>
			<CommandPalette />
		</StrictMode>
	);
}
