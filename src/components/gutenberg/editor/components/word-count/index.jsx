import { useSelect } from '@/stores/gutenberg/data';
import { _x } from '@/lib/gutenberg/i18n';
import { count as wordCount } from '@/utils/gutenberg/wordcount';
import { store as editorStore } from '../../store';

/**
 * Renders the word count of the post content.
 *
 * @return {React.ReactNode} The rendered WordCount component.
 */
export default function WordCount() {
	const content = useSelect(
		( select ) => select( editorStore ).getEditedPostAttribute( 'content' ),
		[]
	);

	/*
	 * translators: If your word count is based on single characters (e.g. East Asian characters),
	 * enter 'characters_excluding_spaces' or 'characters_including_spaces'. Otherwise, enter 'words'.
	 * Do not translate into your own language.
	 */
	const wordCountType = _x( 'words', 'Word count type. Do not translate!' );

	return (
		<span className="word-count">
			{ wordCount( content, wordCountType ) }
		</span>
	);
}
