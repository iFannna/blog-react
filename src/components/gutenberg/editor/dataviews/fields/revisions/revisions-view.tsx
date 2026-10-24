import { Button } from '@/components/gutenberg/ui';
import { useDispatch, useSelect } from '@/stores/gutenberg/data';
import { _n, sprintf } from '@/lib/gutenberg/i18n';
import { store as editorStore } from '../../../store';
import { unlock } from '../../../lock-unlock';

export default function RevisionsView() {
	const { lastRevisionId, revisionsCount } = useSelect( ( select ) => {
		const { getCurrentPostLastRevisionId, getCurrentPostRevisionsCount } =
			select( editorStore );
		return {
			lastRevisionId: getCurrentPostLastRevisionId(),
			revisionsCount: getCurrentPostRevisionsCount(),
		};
	}, [] );
	const { setCurrentRevisionId } = unlock( useDispatch( editorStore ) );

	return (
		<Button
			onClick={ () => setCurrentRevisionId( lastRevisionId ) }
			className="editor-revisions-field-button"
			variant="link"
			text={ String( revisionsCount ) }
			aria-label={ sprintf(
				/* translators: %d: number of revisions. */
				_n(
					'Open revisions screen: %d revision',
					'Open revisions screen: %d revisions',
					revisionsCount
				),
				revisionsCount
			) }
		/>
	);
}
