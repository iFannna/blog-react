import { useSelect } from '@/stores/gutenberg/data';
import { __experimentalVStack as VStack } from '@/components/gutenberg/ui';
import { store as editorStore } from '../../store';
import { unlock } from '../../lock-unlock';
import PostRevisionsTimeline from '../post-revisions-timeline';
import PostPanelSection from '../post-panel-section';
import PostCardPanel from '../post-card-panel';
import RevisionFieldsDiffPanel from '../revision-fields-diff';

export default function PostRevisionSummary() {
	const { revisionId, postId, isViewingBrowserBackup } = useSelect(
		( select ) => {
			const editor = unlock( select( editorStore ) );
			return {
				revisionId: editor.getCurrentRevisionId(),
				postId: editor.getCurrentPostId(),
				isViewingBrowserBackup: editor.isViewingBrowserBackup(),
			};
		},
		[]
	);
	if ( ! revisionId && ! isViewingBrowserBackup ) {
		return null;
	}
	return (
		<>
			<PostPanelSection className="editor-post-summary">
				<VStack spacing={ 4 }>
					<PostCardPanel postId={ postId } hideActions />
				</VStack>
			</PostPanelSection>
			<RevisionFieldsDiffPanel />
			{ ! isViewingBrowserBackup && <PostRevisionsTimeline /> }
		</>
	);
}
