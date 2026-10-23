import { useSelect } from '@/stores/gutenberg/data';
import { Button } from '@/components/gutenberg/ui';
import { __, isRTL } from '@/lib/gutenberg/i18n';
import { addQueryArgs } from '@/utils/gutenberg/url';
import { chevronLeft, chevronRight } from '@/components/gutenberg/icons';
import { store as editorStore } from '@/components/gutenberg/editor';
import { store as coreStore } from '@/stores/gutenberg/core-data';

function FullscreenModeClose( { showTooltip, icon, href, initialPost } ) {
	const postType = useSelect(
		( select ) => {
			const { getCurrentPostType } = select( editorStore );
			const { getPostType } = select( coreStore );
			return getPostType( initialPost?.type || getCurrentPostType() );
		},
		[ initialPost?.type ]
	);

	if ( ! postType ) {
		return null;
	}

	const buttonHref =
		href ??
		addQueryArgs( 'edit.php', {
			post_type: postType.slug,
		} );

	const buttonLabel = postType?.labels?.view_items ?? __( 'Back' );

	return (
		<Button
			size="compact"
			href={ buttonHref }
			label={ buttonLabel }
			showTooltip={ showTooltip }
			tooltipPosition="bottom"
			icon={ icon ?? ( isRTL() ? chevronRight : chevronLeft ) }
		/>
	);
}

export default FullscreenModeClose;
