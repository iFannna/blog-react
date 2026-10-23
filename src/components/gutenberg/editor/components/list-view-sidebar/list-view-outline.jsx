import { __experimentalText as WCText } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import CharacterCount from '../character-count';
import WordCount from '../word-count';
import TimeToRead from '../time-to-read';
import DocumentOutline from '../document-outline';

export default function ListViewOutline() {
	return (
		<>
			<div className="editor-list-view-sidebar__outline">
				<div>
					<WCText>{ __( 'Characters:' ) }</WCText>
					<WCText>
						<CharacterCount />
					</WCText>
				</div>
				<div>
					<WCText>{ __( 'Words:' ) }</WCText>
					<WordCount />
				</div>
				<div>
					<WCText>{ __( 'Time to read:' ) }</WCText>
					<TimeToRead />
				</div>
			</div>
			<DocumentOutline />
		</>
	);
}
