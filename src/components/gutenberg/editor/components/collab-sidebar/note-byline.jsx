import { Stack, Tooltip } from '@/components/gutenberg/design-system';
import { __, _x } from '@/lib/gutenberg/i18n';
import {
	dateI18n,
	getSettings as getDateSettings,
	humanTimeDiff,
	getDate,
} from '@/lib/gutenberg/date';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { useSelect } from '@/stores/gutenberg/data';
import { store as blockEditorStore } from '@/components/gutenberg/block-editor';
import { getAvatarBorderColor } from './utils';

export function NoteByline( { avatar, name, date, userId } ) {
	const hasAvatar = !! avatar;
	const dateSettings = getDateSettings();
	const {
		currentUserAvatar,
		currentUserName,
		currentUserId,
		dateFormat = dateSettings.formats.date,
	} = useSelect(
		( select ) => {
			const { canUser, getCurrentUser, getEntityRecord } =
				select( coreStore );
			const siteSettings = canUser( 'read', {
				kind: 'root',
				name: 'site',
			} )
				? getEntityRecord( 'root', 'site' )
				: undefined;

			if ( hasAvatar ) {
				return {
					dateFormat: siteSettings?.date_format,
				};
			}

			const { getSettings } = select( blockEditorStore );
			const { __experimentalDiscussionSettings } = getSettings();
			const defaultAvatar = __experimentalDiscussionSettings?.avatarURL;
			const userData = getCurrentUser();
			return {
				currentUserAvatar:
					userData?.avatar_urls?.[ 48 ] ?? defaultAvatar,
				currentUserName: userData?.name,
				currentUserId: userData?.id,
				dateFormat: siteSettings?.date_format,
			};
		},
		[ hasAvatar ]
	);

	const commentDate = getDate( date );
	const commentDateTime = dateI18n( 'c', commentDate );
	const shouldShowHumanTimeDiff =
		Math.floor( ( new Date() - commentDate ) / ( 1000 * 60 * 60 * 24 ) ) <
		30;

	const commentDateText = shouldShowHumanTimeDiff
		? humanTimeDiff( commentDate )
		: dateI18n( dateFormat, commentDate );

	const tooltipText = dateI18n(
		// translators: Use a non-breaking space between 'g:i' and 'a' if appropriate.
		_x( 'F j, Y g:i\xa0a', 'Note date full date format' ),
		date
	);

	return (
		<>
			<img
				src={ avatar || currentUserAvatar }
				className="editor-collab-sidebar-panel__user-avatar"
				// translators: alt text for user avatar image
				alt={ __( 'User avatar' ) }
				width={ 32 }
				height={ 32 }
				style={ {
					borderColor: getAvatarBorderColor(
						userId ?? currentUserId
					),
				} }
			/>
			<Stack
				direction="column"
				className="editor-collab-sidebar-panel__user-info"
			>
				<span className="editor-collab-sidebar-panel__user-name">
					{ name ?? currentUserName }
				</span>
				{ date && (
					<Tooltip.Root>
						<Tooltip.Trigger
							render={
								<time
									dateTime={ commentDateTime }
									className="editor-collab-sidebar-panel__user-time"
								>
									{ commentDateText }
								</time>
							}
						/>
						<Tooltip.Popup>{ tooltipText }</Tooltip.Popup>
					</Tooltip.Root>
				) }
			</Stack>
		</>
	);
}
