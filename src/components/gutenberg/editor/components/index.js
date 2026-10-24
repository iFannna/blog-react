import { privateApis as coreDataPrivateApis } from '@/stores/gutenberg/core-data';
import { unlock } from '../lock-unlock';
import EditorKeyboardShortcuts from './global-keyboard-shortcuts';

// Block Creation Components.
export * from './autocompleters';

// Post Related Components.
export { default as AutosaveMonitor } from './autosave-monitor';
export { default as DocumentBar } from './document-bar';
export { default as DocumentOutline } from './document-outline';

export { EditorKeyboardShortcuts };
export { default as EditorKeyboardShortcutsRegister } from './global-keyboard-shortcuts/register-shortcuts';
export { default as EditorHistoryRedo } from './editor-history/redo';
export { default as EditorHistoryUndo } from './editor-history/undo';


export { default as ErrorBoundary } from './error-boundary';
export { default as LocalAutosaveMonitor } from './local-autosave-monitor';
export { default as PageAttributesCheck } from './page-attributes/check';



export { default as PluginDocumentSettingPanel } from './plugin-document-setting-panel';


export { default as PluginPostPublishPanel } from './plugin-post-publish-panel';
export { default as PluginPostStatusInfo } from './plugin-post-status-info';
export { default as PluginPrePublishPanel } from './plugin-pre-publish-panel';

export { default as PluginSidebar } from './plugin-sidebar';







export { default as PostExcerptCheck } from './post-excerpt/check';


export { default as PostFeaturedImageCheck } from './post-featured-image/check';

export { default as PostFormat } from './post-format';
export { default as PostFormatCheck } from './post-format/check';



export { default as PostLockedModal } from './post-locked-modal';



export { default as PostPreviewButton } from './post-preview-button';
export { default as PostPublishButton } from './post-publish-button';
export { default as PostPublishButtonLabel } from './post-publish-button/label';
export { default as PostPublishPanel } from './post-publish-panel';
export { default as PostSavedState } from './post-saved-state';
export { default as PostSchedule } from './post-schedule';

export {
	default as PostScheduleLabel,
	usePostScheduleLabel,
} from './post-schedule/label';

export { default as PostSticky } from './post-sticky';
export { default as PostStickyCheck } from './post-sticky/check';


export { default as PostTaxonomies } from './post-taxonomies';
export { FlatTermSelector as PostTaxonomiesFlatTermSelector } from './post-taxonomies/flat-term-selector';
export { HierarchicalTermSelector as PostTaxonomiesHierarchicalTermSelector } from './post-taxonomies/hierarchical-term-selector';
export { default as PostTaxonomiesCheck } from './post-taxonomies/check';
export { default as PostTaxonomiesPanel } from './post-taxonomies/panel';
export { default as PostTextEditor } from './post-text-editor';
export { default as PostTitle } from './post-title';
export { default as PostTitleRaw } from './post-title/post-title-raw';
export { default as PostTrash } from './post-trash';
export { default as PostTrashCheck } from './post-trash/check';
export { default as PostTypeSupportCheck } from './post-type-support-check';




export { default as PostVisibility } from './post-visibility';
export {
	default as PostVisibilityLabel,
	usePostVisibilityLabel,
} from './post-visibility/label';


export { default as ThemeSupportCheck } from './theme-support-check';
export { default as UnsavedChangesWarning } from './unsaved-changes-warning';
export { default as WordCount } from './word-count';
export { default as TimeToRead } from './time-to-read';
export { default as CharacterCount } from './character-count';

// State Related Components.
export { default as EditorProvider } from './provider';



/**
 * Handles the keyboard shortcuts for the editor.
 *
 * It provides functionality for various keyboard shortcuts such as toggling editor mode,
 * toggling distraction-free mode, undo/redo, saving the post, toggling list view,
 * and toggling the sidebar.
 */
export const VisualEditorGlobalKeyboardShortcuts = EditorKeyboardShortcuts;

/**
 * Handles the keyboard shortcuts for the editor.
 *
 * It provides functionality for various keyboard shortcuts such as toggling editor mode,
 * toggling distraction-free mode, undo/redo, saving the post, toggling list view,
 * and toggling the sidebar.
 */
export const TextEditorGlobalKeyboardShortcuts = EditorKeyboardShortcuts;

const { EntitiesSavedStates, useEntitiesSavedStatesIsDirty } =
	unlock( coreDataPrivateApis );

export { EntitiesSavedStates, useEntitiesSavedStatesIsDirty };
