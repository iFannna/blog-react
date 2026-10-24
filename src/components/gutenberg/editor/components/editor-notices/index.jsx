import deprecated from '@/utils/gutenberg/deprecated';
import { InlineNotices } from '@/stores/gutenberg/notices';

/**
 * @deprecated since 7.0, use `wp.notices.InlineNotices` instead.
 */
export function EditorNotices() {
	deprecated( 'wp.editor.EditorNotices', {
		since: '7.0',
		version: '7.2',
		alternative: 'wp.notices.InlineNotices',
	} );

	return (
		<InlineNotices
			pinnedNoticesClassName="components-editor-notices__pinned"
			dismissibleNoticesClassName="components-editor-notices__dismissible"
		/>
	);
}

export default EditorNotices;
