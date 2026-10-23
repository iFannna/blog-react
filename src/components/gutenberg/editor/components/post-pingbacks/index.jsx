import { __ } from '@/lib/gutenberg/i18n';
import { CheckboxControl as WCCheckboxControl } from '@/components/gutenberg/ui';
import { useDispatch, useSelect } from '@/stores/gutenberg/data';
import { store as editorStore } from '../../store';

function PostPingbacks() {
	const pingStatus = useSelect(
		( select ) =>
			select( editorStore ).getEditedPostAttribute( 'ping_status' ) ??
			'open',
		[]
	);
	const { editPost } = useDispatch( editorStore );
	const onTogglePingback = () =>
		editPost( {
			ping_status: pingStatus === 'open' ? 'closed' : 'open',
		} );

	return (
		<WCCheckboxControl
			label={ __( 'Enable pingbacks & trackbacks' ) }
			checked={ pingStatus === 'open' }
			onChange={ onTogglePingback }
		/>
	);
}

/**
 * Renders a control for enabling or disabling pingbacks and trackbacks
 * in a WordPress post.
 *
 * @module PostPingbacks
 */
export default PostPingbacks;
