import { useSelect, useDispatch } from '@/stores/gutenberg/data';
import { __ } from '@/lib/gutenberg/i18n';
import { fullscreen } from '@/components/gutenberg/icons';
import { useCommand } from '@/lib/gutenberg/commands';
import { store as preferencesStore } from '@/stores/gutenberg/preferences';
import { store as noticesStore } from '@/stores/gutenberg/notices';

export default function useCommands() {
	const { isFullscreen } = useSelect( ( select ) => {
		const { get } = select( preferencesStore );

		return {
			isFullscreen: get( 'core/edit-post', 'fullscreenMode' ),
		};
	}, [] );
	const { toggle } = useDispatch( preferencesStore );
	const { createInfoNotice } = useDispatch( noticesStore );

	useCommand( {
		name: 'core/toggle-fullscreen-mode',
		label: isFullscreen
			? __( 'Exit fullscreen' )
			: __( 'Enter fullscreen' ),
		icon: fullscreen,
		category: 'command',
		callback: ( { close } ) => {
			toggle( 'core/edit-post', 'fullscreenMode' );
			close();
			createInfoNotice(
				isFullscreen ? __( 'Fullscreen off.' ) : __( 'Fullscreen on.' ),
				{
					id: 'core/edit-post/toggle-fullscreen-mode/notice',
					type: 'snackbar',
					actions: [
						{
							label: __( 'Undo' ),
							onClick: () => {
								toggle( 'core/edit-post', 'fullscreenMode' );
							},
						},
					],
				}
			);
		},
	} );
}
