import { useSelect } from '@/stores/gutenberg/data';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { Notice } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { store as editorStore } from '../../store';
import { TEMPLATE_POST_TYPE } from '../../store/constants';
import EditorInterface from '../editor-interface';
import { ExperimentalEditorProvider } from '../provider';
import Sidebar from '../sidebar';
import GlobalStylesSidebar from '../global-styles-sidebar';
import { GlobalStylesRenderer } from '../global-styles-renderer';

function Editor( {
	postType,
	postId,
	templateId,
	settings,
	children,
	initialEdits,
	initialViewport,
	renderingMode,

	// This could be part of the settings.
	onActionPerformed,
	...props
} ) {
	const {
		post,
		template,
		hasLoadedPost,
		error,
		isBlockTheme,
		showGlobalStyles,
	} = useSelect(
		( select ) => {
			const {
				getEntityRecord,
				getResolutionError,
				hasFinishedResolution,
				getCurrentTheme,
				__experimentalGetCurrentGlobalStylesId,
				canUser,
			} = select( coreStore );
			const { getRenderingMode, getCurrentPostType } =
				select( editorStore );

			const postArgs = [ 'postType', postType, postId ];
			// Named apart from the `renderingMode` prop, which is what this
			// editor was told to be in rather than what it is in now.
			const currentRenderingMode = getRenderingMode();
			const currentPostType = getCurrentPostType();
			const _isBlockTheme = getCurrentTheme()?.is_block_theme;
			const globalStylesId = __experimentalGetCurrentGlobalStylesId();
			const userCanEditGlobalStyles = globalStylesId
				? canUser( 'update', {
						kind: 'root',
						name: 'globalStyles',
						id: globalStylesId,
					} )
				: false;

			return {
				post: getEntityRecord( ...postArgs ),
				template: templateId
					? getEntityRecord(
							'postType',
							TEMPLATE_POST_TYPE,
							templateId
						)
					: undefined,
				hasLoadedPost: hasFinishedResolution(
					'getEntityRecord',
					postArgs
				),
				error: getResolutionError( 'getEntityRecord', postArgs )
					?.message,
				isBlockTheme: _isBlockTheme,
				showGlobalStyles:
					_isBlockTheme &&
					userCanEditGlobalStyles &&
					( currentPostType === 'wp_template' ||
						currentRenderingMode === 'template-locked' ),
			};
		},
		[ postType, postId, templateId ]
	);

	return (
		<>
			{ hasLoadedPost && ! post && (
				<Notice
					status={ !! error ? 'error' : 'warning' }
					isDismissible={ false }
				>
					{ ! error
						? __(
								"You attempted to edit an item that doesn't exist. Perhaps it was deleted?"
							)
						: error }
				</Notice>
			) }
			{ !! post && (
				<ExperimentalEditorProvider
					post={ post }
					__unstableTemplate={ template }
					settings={ settings }
					initialEdits={ initialEdits }
					initialViewport={ initialViewport }
					renderingMode={ renderingMode }
					useSubRegistry={ false }
				>
					<EditorInterface { ...props } />
					{ children }
					<Sidebar onActionPerformed={ onActionPerformed } />
					{ isBlockTheme && <GlobalStylesRenderer /> }
					{ showGlobalStyles && <GlobalStylesSidebar /> }
				</ExperimentalEditorProvider>
			) }
		</>
	);
}

export default Editor;
