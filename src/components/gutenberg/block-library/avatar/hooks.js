import { store as coreStore, useEntityProp } from '@/stores/gutenberg/core-data';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import { useSelect } from '@/stores/gutenberg/data';
import { isProjectContentSource } from '@/services/gutenberg/project/content';
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
	const { authorDetails, projectAuthor } = useSelect(
		( select ) => {
			const { getEditedEntityRecord, getUser } = select( coreStore );
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
			if ( isProjectContentSource() ) {
				return {
					authorDetails: null,
					projectAuthor: currentPost?._project ?? null,
				};
			}
			const _authorId = currentPost?.author;

			return {
				authorDetails: _authorId ? getUser( _authorId ) : null,
				projectAuthor: null,
			};
		},
		[ postType, postId, userId ]
	);
	const avatarUrls = authorDetails?.avatar_urls
		? Object.values( authorDetails.avatar_urls )
		: null;
	const sizes = authorDetails?.avatar_urls
		? Object.keys( authorDetails.avatar_urls )
		: null;
	const { minSize, maxSize } = getAvatarSizes( sizes );
	const defaultAvatar = useDefaultAvatar();
	const authorName = projectAuthor
		? projectAuthor.authorName
		: authorDetails?.name;
	const src = projectAuthor
		? projectAuthor.authorAvatar || defaultAvatar
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
