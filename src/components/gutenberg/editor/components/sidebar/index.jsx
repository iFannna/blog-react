import {
	BlockInspector,
	store as blockEditorStore,
} from '@/components/gutenberg/block-editor';
import { useSelect, useDispatch } from '@/stores/gutenberg/data';
import { isRTL, __, _x } from '@/lib/gutenberg/i18n';
import { drawerLeft, drawerRight } from '@/components/gutenberg/icons';
import { store as keyboardShortcutsStore } from '@/components/gutenberg/keyboard-shortcuts';
import { store as interfaceStore } from '@/components/gutenberg/interface';
import { Tabs } from '@/components/gutenberg/design-system';
import PatternOverridesPanel from '../pattern-overrides-panel';
import PluginDocumentSettingPanel from '../plugin-document-setting-panel';
import PluginSidebar from '../plugin-sidebar';
import DataFormPostSummary from './dataform-post-summary';
import PostRevisionSummary from './post-revision-summary';
import PostTaxonomiesPanel from '../post-taxonomies/panel';
import PostTransformPanel from '../post-transform-panel';
import SidebarHeader from './header';
import RevisionBlockDiffPanel from '../revision-block-diff';
import useAutoSwitchEditorSidebars from '../provider/use-auto-switch-editor-sidebars';
import { sidebars } from './constants';
import { unlock } from '../../lock-unlock';
import { store as editorStore } from '../../store';

const SIDEBAR_ACTIVE_BY_DEFAULT = true;

function Sidebar( { onActionPerformed } ) {
	useAutoSwitchEditorSidebars();

	const { tabName, keyboardShortcut, isRevisionsMode } = useSelect(
		( select ) => {
			const shortcut = select(
				keyboardShortcutsStore
			).getShortcutRepresentation( 'core/editor/toggle-sidebar' );

			const sidebar =
				select( interfaceStore ).getActiveComplementaryArea( 'core' );
			const _isEditorSidebarOpened = [
				sidebars.block,
				sidebars.document,
			].includes( sidebar );
			let _tabName = sidebar;
			if ( ! _isEditorSidebarOpened ) {
				_tabName = select( blockEditorStore ).getBlockSelectionStart()
					? sidebars.block
					: sidebars.document;
			}

			return {
				tabName: _tabName,
				keyboardShortcut: shortcut,
				isRevisionsMode: unlock(
					select( editorStore )
				).isRevisionsMode(),
			};
		},
		[]
	);

	const { enableComplementaryArea } = useDispatch( interfaceStore );

	function onTabSelect( newSelectedTabId ) {
		enableComplementaryArea( 'core', newSelectedTabId );
	}

	let tabContent;
	if ( isRevisionsMode ) {
		tabContent = <PostRevisionSummary />;
	} else {
		tabContent = (
			<>
				<DataFormPostSummary onActionPerformed={ onActionPerformed } />
				<PluginDocumentSettingPanel.Slot />
				<PostTransformPanel />
				<PostTaxonomiesPanel />
				<PatternOverridesPanel />
			</>
		);
	}

	return (
		<PluginSidebar
			identifier={ tabName }
			header={ <SidebarHeader /> }
			closeLabel={ __( 'Close Settings' ) }
			className="editor-sidebar__panel"
			headerClassName="editor-sidebar__panel-tabs"
			title={
				/* translators: button label text should, if possible, be under 16 characters. */
				_x( 'Settings', 'panel button label' )
			}
			toggleShortcut={ keyboardShortcut }
			icon={ isRTL() ? drawerLeft : drawerRight }
			isActiveByDefault={ SIDEBAR_ACTIVE_BY_DEFAULT }
			// Makes `Tabs.Root` the container, so the tab list passed as
			// `header` and the panels below share a subtree across the fill.
			render={
				<Tabs.Root value={ tabName } onValueChange={ onTabSelect } />
			}
		>
			<Tabs.Panel value={ sidebars.document } tabIndex={ -1 }>
				{ tabContent }
			</Tabs.Panel>
			<Tabs.Panel value={ sidebars.block } tabIndex={ -1 }>
				<BlockInspector />
				{ isRevisionsMode && <RevisionBlockDiffPanel /> }
			</Tabs.Panel>
		</PluginSidebar>
	);
}

export default Sidebar;
