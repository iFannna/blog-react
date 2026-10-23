import { __, _x } from '@/lib/gutenberg/i18n';
import { useSelect } from '@/stores/gutenberg/data';
import { decodeEntities } from '@/utils/gutenberg/html-entities';
import { Tabs } from '@/components/gutenberg/design-system';
import { store as editorStore } from '../../store';
import { unlock } from '../../lock-unlock';
import { sidebars } from './constants';

export default function SidebarHeader() {
	const { postTypeLabel, isRevisionsMode } = useSelect( ( select ) => {
		const { getPostTypeLabel } = select( editorStore );
		const { isRevisionsMode: _isRevisionsMode } = unlock(
			select( editorStore )
		);
		return {
			postTypeLabel: getPostTypeLabel(),
			isRevisionsMode: _isRevisionsMode(),
		};
	}, [] );

	let documentLabel;
	if ( isRevisionsMode ) {
		documentLabel = __( 'Revision' );
	} else if ( postTypeLabel ) {
		documentLabel = decodeEntities( postTypeLabel );
	} else {
		// translators: Default label for the Document sidebar tab, not selected.
		documentLabel = _x( 'Document', 'noun, panel' );
	}

	return (
		<Tabs.List activateOnFocus={ false }>
			<Tabs.Tab value={ sidebars.document }>{ documentLabel }</Tabs.Tab>
			<Tabs.Tab value={ sidebars.block }>
				{ /* translators: Text label for the Block Settings Sidebar tab. */ }
				{ __( 'Block' ) }
			</Tabs.Tab>
		</Tabs.List>
	);
}
