import { store as coreStore } from '@/stores/gutenberg/core-data';
import { useSelect } from '@/stores/gutenberg/data';
import { privateApis as editorPrivateApis } from '@/components/gutenberg/editor';
import { __ } from '@/lib/gutenberg/i18n';
import { addQueryArgs } from '@/utils/gutenberg/url';
import { unlock } from '../../lock-unlock';

const { MoreMenuItem } = unlock( editorPrivateApis );

function ManagePatternsMenuItem() {
	const url = useSelect( ( select ) => {
		const { canUser } = select( coreStore );
		const defaultUrl = addQueryArgs( 'edit.php', {
			post_type: 'wp_block',
		} );
		const patternsUrl = addQueryArgs( 'site-editor.php', {
			p: '/pattern',
		} );

		// The site editor and templates both check whether the user has
		// edit_theme_options capabilities. We can leverage that here and not
		// display the manage patterns link if the user can't access it.
		return canUser( 'create', {
			kind: 'postType',
			name: 'wp_template',
		} )
			? patternsUrl
			: defaultUrl;
	}, [] );

	return (
		<MoreMenuItem href={ url }>{ __( 'Manage patterns' ) }</MoreMenuItem>
	);
}

export default ManagePatternsMenuItem;
