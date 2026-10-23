import { useSelect, useDispatch } from '@/stores/gutenberg/data';
import { __ } from '@/lib/gutenberg/i18n';
import { useCopyToClipboard } from '@/hooks/gutenberg/compose';
import { store as noticesStore } from '@/stores/gutenberg/notices';
// eslint-disable-next-line @wordpress/use-recommended-components
import { Menu } from '@/components/gutenberg/design-system';
import { store as editorStore } from '../../store';

export default function CopyContentMenuItem() {
	const { createNotice } = useDispatch( noticesStore );
	const { getEditedPostContent } = useSelect( editorStore );

	function getText() {
		return getEditedPostContent();
	}

	function onSuccess() {
		createNotice( 'info', __( 'All content copied.' ), {
			isDismissible: true,
			type: 'snackbar',
		} );
	}

	const ref = useCopyToClipboard( getText, onSuccess );

	return (
		<Menu.Item ref={ ref }>
			<Menu.ItemLabel>{ __( 'Copy all blocks' ) }</Menu.ItemLabel>
		</Menu.Item>
	);
}
