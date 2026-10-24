import { useLayoutEffect } from '@/lib/gutenberg/element';
import { useDispatch } from '@/stores/gutenberg/data';
import { __ } from '@/lib/gutenberg/i18n';
import { store as noticesStore } from '@/stores/gutenberg/notices';
import { getQueryArg } from '@/utils/gutenberg/url';
import { store as editorStore } from '../../store';
import { unlock } from '../../lock-unlock';

/**
 * Creates the warning notice about a more recent autosave.
 *
 * @param {Object}   props                      Function props.
 * @param {Object}   props.autosave             The `autosave` editor setting.
 * @param {Function} props.createWarningNotice  Action that creates the notice.
 * @param {Function} props.setCurrentRevisionId Action that opens a revision.
 */
function showAutosaveExistsNotice( {
	autosave,
	createWarningNotice,
	setCurrentRevisionId,
} ) {
	// The only place core exposes the autosave ID is the edit link's
	// `revision` query arg.
	const autosaveId = Number( getQueryArg( autosave.editLink, 'revision' ) );
	createWarningNotice(
		__(
			'There is an autosave of this post that is more recent than the version below.'
		),
		{
			id: 'autosave-exists',
			actions: [
				{
					label: __( 'View the autosave' ),
					...( autosaveId
						? {
								onClick: () =>
									setCurrentRevisionId( autosaveId ),
							}
						: { url: autosave.editLink } ),
				},
			],
		}
	);
}

/**
 * Shows the "more recent autosave" notice when applicable.
 *
 * The notice is created immediately on mount whenever the server flagged an
 * autosave (`settings.autosave`).
 *
 * @param {Object}  props          Hook props.
 * @param {boolean} props.recovery Whether the editor is in recovery mode.
 * @param {Object}  props.settings The editor settings.
 */
export default function useAutosaveNotice( { recovery, settings } ) {
	const { createWarningNotice } = useDispatch( noticesStore );
	const { setCurrentRevisionId } = unlock( useDispatch( editorStore ) );

	useLayoutEffect( () => {
		if ( recovery || ! settings.autosave ) {
			return;
		}

		showAutosaveExistsNotice( {
			autosave: settings.autosave,
			createWarningNotice,
			setCurrentRevisionId,
		} );

		// The notice is created once on mount. `settings.autosave` and the
		// notice actions are stable for the lifetime of the provider.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );
}
