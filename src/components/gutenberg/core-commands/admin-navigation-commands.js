import { useCommandLoader, useCommands } from '@/lib/gutenberg/commands';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import { external } from '@/components/gutenberg/icons';
import { useMemo } from '@/lib/gutenberg/element';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { useSelect } from '@/stores/gutenberg/data';

const getViewSiteCommand = () =>
	function useViewSiteCommand() {
		const homeUrl = useSelect( ( select ) => {
			// Site index.
			return select( coreStore ).getEntityRecord(
				'root',
				'__unstableBase'
			)?.home;
		}, [] );

		const commands = useMemo( () => {
			if ( ! homeUrl ) {
				return [];
			}

			return [
				{
					name: 'core/view-site',
					label: __( 'View site' ),
					icon: external,
					category: 'view',
					callback: ( { close } ) => {
						close();
						window.open( homeUrl, '_blank' );
					},
				},
			];
		}, [ homeUrl ] );

		return {
			isLoading: false,
			commands,
		};
	};

export function useAdminNavigationCommands( menuCommands ) {
	const commands = useMemo( () => {
		return ( menuCommands ?? [] ).map( ( menuCommand ) => {
			const label = sprintf(
				/* translators: %s: menu label */
				__( 'Go to: %s' ),
				menuCommand.label
			);
			return {
				name: menuCommand.name,
				label,
				searchLabel: label,
				category: 'view',
				callback: ( { close } ) => {
					document.location = menuCommand.url;
					close();
				},
			};
		} );
	}, [ menuCommands ] );
	useCommands( commands );

	useCommandLoader( {
		name: 'core/view-site',
		hook: getViewSiteCommand(),
	} );
}
