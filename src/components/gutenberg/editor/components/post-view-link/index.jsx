import { __ } from '@/lib/gutenberg/i18n';
import { Button } from '@/components/gutenberg/ui';
import { external } from '@/components/gutenberg/icons';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { useSelect } from '@/stores/gutenberg/data';
import { store as preferencesStore } from '@/stores/gutenberg/preferences';
import { store as editorStore } from '../../store';

export default function PostViewLink() {
	const { hasLoaded, permalink, isPublished, label, showIconLabels } =
		useSelect( ( select ) => {
			// Grab post type to retrieve the view_item label.
			const postTypeSlug = select( editorStore ).getCurrentPostType();
			const postType = select( coreStore ).getPostType( postTypeSlug );
			const { get } = select( preferencesStore );

			return {
				permalink: select( editorStore ).getPermalink(),
				isPublished: select( editorStore ).isCurrentPostPublished(),
				label: postType?.labels?.view_item,
				hasLoaded: !! postType,
				showIconLabels: get( 'core', 'showIconLabels' ),
			};
		}, [] );

	// Only render the view button if the post is published and has a permalink.
	if ( ! isPublished || ! permalink || ! hasLoaded ) {
		return null;
	}

	return (
		<Button
			icon={ external }
			label={ label || __( 'View post' ) }
			href={ permalink }
			target="_blank"
			showTooltip={ ! showIconLabels }
			size="compact"
		/>
	);
}
