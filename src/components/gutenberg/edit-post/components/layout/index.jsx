import clsx from 'clsx';
import { getAdminThemeColors } from './admin-theme-colors';
import {
	AutosaveMonitor,
	LocalAutosaveMonitor,
	UnsavedChangesWarning,
	ErrorBoundary,
	PostLockedModal,
	store as editorStore,
	privateApis as editorPrivateApis,
} from '@/components/gutenberg/editor';
import { useSelect, useDispatch } from '@/stores/gutenberg/data';
import { store as blockEditorStore } from '@/components/gutenberg/block-editor';
import { getLayoutStyles } from '@/lib/gutenberg/global-styles-engine';
import { PluginArea } from '@/lib/gutenberg/plugins';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import { useCallback, useMemo } from '@/lib/gutenberg/element';
import { SnackbarNotices, store as noticesStore } from '@/stores/gutenberg/notices';
import { store as preferencesStore } from '@/stores/gutenberg/preferences';
import { privateApis as commandsPrivateApis } from '@/lib/gutenberg/commands';
import { addQueryArgs } from '@/utils/gutenberg/url';
import { decodeEntities } from '@/utils/gutenberg/html-entities';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import {
	SlotFillProvider,
	__unstableUseNavigateRegions as useNavigateRegions,
} from '@/components/gutenberg/ui';
import { ThemeProvider } from '@/lib/gutenberg/theme';
import { Tooltip } from '@/components/gutenberg/design-system';
import EditorInitialization from '../editor-initialization';
import EditPostKeyboardShortcuts from '../keyboard-shortcuts';
import InitPatternModal from '../init-pattern-modal';
import BrowserURL from '../browser-url';
import PostEditorMoreMenu from '../more-menu';
import { store as editPostStore } from '../../store';
import { unlock } from '../../lock-unlock';
import useEditPostCommands from '../../commands/use-commands';
import useNavigateToEntityRecord from '../../hooks/use-navigate-to-entity-record';

const { useCommandContext } = unlock( commandsPrivateApis );
const { Editor, FullscreenMode, UploadProgressSnackbar } =
	unlock( editorPrivateApis );

function useEditorStyles( settings ) {
	const { hasThemeStyleSupport } = useSelect( ( select ) => {
		return {
			hasThemeStyleSupport:
				select( editPostStore ).isFeatureActive( 'themeStyles' ),
		};
	}, [] );

	// Compute the default styles.
	return useMemo( () => {
		const presetStyles =
			settings.styles?.filter(
				( style ) =>
					style.__unstableType && style.__unstableType !== 'theme'
			) ?? [];

		const defaultEditorStyles = [
			...( settings?.defaultEditorStyles ?? [] ),
			...presetStyles,
		];

		// Has theme styles if the theme supports them and if some styles were not preset styles (in which case they're theme styles).
		const hasThemeStyles =
			hasThemeStyleSupport &&
			presetStyles.length !== ( settings.styles?.length ?? 0 );

		// If theme styles are not present or displayed, ensure that
		// base layout styles are still present in the editor.
		if ( ! settings.disableLayoutStyles && ! hasThemeStyles ) {
			defaultEditorStyles.push( {
				css: getLayoutStyles( {
					style: {},
					selector: 'body',
					hasBlockGapSupport: false,
					hasFallbackGapSupport: true,
					fallbackGapValue: '0.5em',
				} ),
			} );
		}

		return hasThemeStyles ? ( settings.styles ?? [] ) : defaultEditorStyles;
	}, [
		settings.defaultEditorStyles,
		settings.disableLayoutStyles,
		settings.styles,
		hasThemeStyleSupport,
	] );
}

function Layout( {
	postId: initialPostId,
	postType: initialPostType,
	settings,
	initialEdits,
} ) {
	useEditPostCommands();
	const { createErrorNotice } = useDispatch( noticesStore );
	const {
		currentPost: { postId: currentPostId, postType: currentPostType },
		onNavigateToEntityRecord,
		onNavigateToPreviousEntityRecord,
	} = useNavigateToEntityRecord(
		initialPostId,
		initialPostType,
		'post-only'
	);
	const isEditingTemplate = currentPostType === 'wp_template';
	const {
		mode,
		isFullscreenActive,
		hasBlockSelected,
		showIconLabels,
		templateId,
	} = useSelect(
		( select ) => {
			const { get } = select( preferencesStore );
			const { isFeatureActive } = select( editPostStore );
			const { canUser, getPostType, getTemplateId } = unlock(
				select( coreStore )
			);

			const supportsTemplateMode = settings.supportsTemplateMode;
			const isViewable =
				getPostType( currentPostType )?.viewable ?? false;
			const canViewTemplate = canUser( 'read', {
				kind: 'postType',
				name: 'wp_template',
			} );
			const { getBlockSelectionStart } = unlock(
				select( blockEditorStore )
			);
			const { getEditorMode } = unlock( select( editorStore ) );
			const _templateId = getTemplateId( currentPostType, currentPostId );

			return {
				mode: getEditorMode(),
				isFullscreenActive: isFeatureActive( 'fullscreenMode' ),
				hasBlockSelected: !! getBlockSelectionStart(),
				showIconLabels: get( 'core', 'showIconLabels' ),
				templateId:
					supportsTemplateMode &&
					isViewable &&
					canViewTemplate &&
					! isEditingTemplate
						? _templateId
						: null,
			};
		},
		[
			currentPostType,
			currentPostId,
			isEditingTemplate,
			settings.supportsTemplateMode,
		]
	);

	// Set the right context for the command palette
	const commandContext = hasBlockSelected
		? 'block-selection-edit'
		: 'entity-edit';
	useCommandContext( commandContext );
	const styles = useEditorStyles( settings );
	const editorSettings = useMemo(
		() => ( {
			...settings,
			styles,
			onNavigateToEntityRecord,
			onNavigateToPreviousEntityRecord,
		} ),
		[
			settings,
			styles,
			onNavigateToEntityRecord,
			onNavigateToPreviousEntityRecord,
		]
	);

	// We need to add the show-icon-labels class to the body element so it is applied to modals.
	if ( showIconLabels ) {
		document.body.classList.add( 'show-icon-labels' );
	} else {
		document.body.classList.remove( 'show-icon-labels' );
	}

	const navigateRegionsProps = useNavigateRegions();

	const className = clsx( 'edit-post-layout', 'is-mode-' + mode );

	function onPluginAreaError( name ) {
		createErrorNotice(
			sprintf(
				/* translators: %s: plugin name */
				__(
					'The "%s" plugin has encountered an error and cannot be rendered.'
				),
				name
			)
		);
	}

	const { createSuccessNotice } = useDispatch( noticesStore );

	const onActionPerformed = useCallback(
		( actionId, items ) => {
			switch ( actionId ) {
				case 'move-to-trash':
					{
						document.location.href = addQueryArgs( 'edit.php', {
							trashed: 1,
							post_type: items[ 0 ].type,
							ids: items[ 0 ].id,
						} );
					}
					break;
				case 'permanently-delete':
					{
						document.location.href = addQueryArgs( 'edit.php', {
							deleted: 1,
							post_type: items[ 0 ].type,
						} );
					}
					break;
				case 'duplicate-post':
					{
						const newItem = items[ 0 ];
						const title =
							typeof newItem.title === 'string'
								? newItem.title
								: newItem.title?.rendered;
						createSuccessNotice(
							sprintf(
								// translators: %s: Title of the created post or template, e.g: "Hello world".
								__( '"%s" successfully created.' ),
								decodeEntities( title ) || __( '(no title)' )
							),
							{
								type: 'snackbar',
								id: 'duplicate-post-action',
								actions: [
									{
										label: __( 'Edit' ),
										onClick: () => {
											const postId = newItem.id;
											document.location.href =
												addQueryArgs( 'post.php', {
													post: postId,
													action: 'edit',
												} );
										},
									},
								],
							}
						);
					}
					break;
			}
		},
		[ createSuccessNotice ]
	);

	const adminPrimary = useMemo( () => getAdminThemeColors().primary, [] );

	return (
		<SlotFillProvider>
			<Tooltip.Provider>
				<ThemeProvider isRoot color={ { primary: adminPrimary } }>
					<ErrorBoundary canCopyContent>
						<div { ...navigateRegionsProps }>
							<Editor
								settings={ editorSettings }
								// The initial edits belong to the post the editor was
								// opened with, not to entities navigated to from it.
								initialEdits={
									currentPostId === initialPostId &&
									currentPostType === initialPostType
										? initialEdits
										: undefined
								}
								postType={ currentPostType }
								postId={ currentPostId }
								templateId={ templateId }
								className={ className }
								// We should auto-focus the canvas (title) on load.
								// eslint-disable-next-line jsx-a11y/no-autofocus
								autoFocus
								onActionPerformed={ onActionPerformed }
							>
								<PostLockedModal />
								<EditorInitialization />
								<FullscreenMode
									isActive={ isFullscreenActive }
								/>
								{ ! settings.__previewOnly && <BrowserURL /> }
								{ ! settings.__previewOnly && (
									<UnsavedChangesWarning />
								) }
								{ ! settings.__previewOnly && (
									<AutosaveMonitor />
								) }
								{ ! settings.__previewOnly && (
									<LocalAutosaveMonitor />
								) }
								<EditPostKeyboardShortcuts />
								{ currentPostType === 'wp_block' && (
									<InitPatternModal />
								) }
								<PluginArea onError={ onPluginAreaError } />
								<PostEditorMoreMenu />
								<SnackbarNotices className="edit-post-layout__snackbar" />
								<UploadProgressSnackbar />
							</Editor>
						</div>
					</ErrorBoundary>
				</ThemeProvider>
			</Tooltip.Provider>
		</SlotFillProvider>
	);
}

export default Layout;
