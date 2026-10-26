import { store as coreStore, useEntityProp } from '@/stores/gutenberg/core-data';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import { useSelect } from '@/stores/gutenberg/data';
import {
	isProjectContentSource,
	useProjectUserOptions,
	useProjectViewerProfile,
} from '@/services/gutenberg/project/content';
import { DEFAULT_AVATAR } from '@/utils/mock';
import { useDefaultAvatar } from '../utils/hooks';

function getAvatarSizes( sizes ) {
	const minSize = sizes ? sizes[ 0 ] : 24;
	const maxSize = sizes ? sizes[ sizes.length - 1 ] : 96;
	const maxSizeBuffer = Math.floor( maxSize * 2.5 );
	return {
		minSize,
		maxSize: maxSizeBuffer,
	};
}

export function useCommentAvatar( { commentId } ) {
	const [ avatars ] = useEntityProp(
		'root',
		'comment',
		'author_avatar_urls',
		commentId
	);

	const [ authorName ] = useEntityProp(
		'root',
		'comment',
		'author_name',
		commentId
	);
	const avatarUrls = avatars ? Object.values( avatars ) : null;
	const sizes = avatars ? Object.keys( avatars ) : null;
	const { minSize, maxSize } = getAvatarSizes( sizes );
	const defaultAvatar = useDefaultAvatar();
	return {
		src: avatarUrls ? avatarUrls[ avatarUrls.length - 1 ] : defaultAvatar,
		minSize,
		maxSize,
		alt: authorName
			? // translators: %s: Author name.
				sprintf( __( '%s Avatar' ), authorName )
			: __( 'Default Avatar' ),
	};
}

export function useUserAvatar( { userId, postId, postType } ) {
	const projectActive = isProjectContentSource();
	const projectUsers = useProjectUserOptions();
	const projectViewer = useProjectViewerProfile();
	const { authorDetails, projectAuthor } = useSelect(
		( select ) => {
			const { getEditedEntityRecord, getUser } = select( coreStore );
			if ( projectActive ) {
				const currentPost = getEditedEntityRecord(
					'postType',
					postType,
					postId
				);
				return {
					authorDetails: null,
					projectAuthor: currentPost?._project ?? null,
				};
			}
			if ( userId ) {
				return {
					authorDetails: getUser( userId ),
					projectAuthor: null,
				};
			}
			const currentPost = getEditedEntityRecord(
				'postType',
				postType,
				postId
			);
			const _authorId = currentPost?.author;

			return {
				authorDetails: _authorId ? getUser( _authorId ) : null,
				projectAuthor: null,
			};
		},
		[ postType, postId, userId, projectActive ]
	);
	const avatarUrls = authorDetails?.avatar_urls
		? Object.values( authorDetails.avatar_urls )
		: null;
	const sizes = authorDetails?.avatar_urls
		? Object.keys( authorDetails.avatar_urls )
		: null;
	const { minSize, maxSize } = getAvatarSizes( sizes );
	const defaultAvatar = useDefaultAvatar();
	const projectUser = userId
		? projectUsers?.find( ( user ) => user.id === userId )
		: null;
	const hasProjectAuthor = Boolean(
		projectAuthor?.authorName || projectAuthor?.authorAvatar
	);
	const projectAuthorName = userId
		? projectUser?.nickname
		: projectAuthor?.authorName ||
			( hasProjectAuthor ? '' : projectViewer?.nickname );
	const projectAvatar = userId
		? projectUser?.avatar
		: projectAuthor?.authorAvatar ||
			( hasProjectAuthor ? '' : projectViewer?.avatar );
	const authorName = projectActive ? projectAuthorName : authorDetails?.name;
	const src = projectActive
		? projectAvatar || DEFAULT_AVATAR
		: avatarUrls
			? avatarUrls[ avatarUrls.length - 1 ]
			: defaultAvatar;
	return {
		src,
		minSize,
		maxSize,
		alt: authorName
			? // translators: %s: Author name.
				sprintf( __( '%s Avatar' ), authorName )
			: __( 'Default Avatar' ),
	};
}
