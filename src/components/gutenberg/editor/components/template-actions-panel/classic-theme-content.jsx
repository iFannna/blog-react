import { useSelect, useDispatch } from '@/stores/gutenberg/data';
import {
	useEntityRecord,
	useEntityBlockEditor,
	store as coreStore,
} from '@/stores/gutenberg/core-data';
import { BlockPreview } from '@/components/gutenberg/block-editor';
import {
	PanelBody,
	Button,
	__experimentalText as WCText,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@/components/gutenberg/ui';
import { useState } from '@/lib/gutenberg/element';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import { decodeEntities } from '@/utils/gutenberg/html-entities';
import { store as noticesStore } from '@/stores/gutenberg/notices';
import { store as preferencesStore } from '@/stores/gutenberg/preferences';
import { store as editorStore } from '../../store';
import CreateNewTemplateModal from '../post-template/create-new-template-modal';

export default function ClassicThemeContent() {
	const templateId = useSelect(
		( select ) => select( editorStore ).getCurrentTemplateId(),
		[]
	);
	const [ isCreateModalOpen, setIsCreateModalOpen ] = useState( false );
	const {
		onNavigateToEntityRecord,
		canCreateTemplate,
		hasGoBack,
		getEditorSettings,
	} = useSelect( ( select ) => {
		const { getEditorSettings: _getEditorSettings } = select( editorStore );
		const editorSettings = _getEditorSettings();
		return {
			onNavigateToEntityRecord: editorSettings.onNavigateToEntityRecord,
			canCreateTemplate:
				!! select( coreStore ).canUser( 'create', {
					kind: 'postType',
					name: 'wp_template',
				} ) && editorSettings.supportsTemplateMode,
			hasGoBack: editorSettings.hasOwnProperty(
				'onNavigateToPreviousEntityRecord'
			),
			getEditorSettings: _getEditorSettings,
		};
	}, [] );
	const { get: getPreference } = useSelect( preferencesStore );
	const { createSuccessNotice } = useDispatch( noticesStore );
	const { editedRecord: template } = useEntityRecord(
		'postType',
		'wp_template',
		templateId
	);
	const [ blocks ] = useEntityBlockEditor( 'postType', 'wp_template', {
		id: templateId,
	} );

	// Path A: No block template and cannot create templates.
	if ( ! templateId && ! canCreateTemplate ) {
		return null;
	}

	const notificationAction = hasGoBack
		? [
				{
					label: __( 'Back' ),
					onClick: () =>
						getEditorSettings().onNavigateToPreviousEntityRecord(),
				},
			]
		: undefined;

	const mayShowTemplateEditNotice = () => {
		if ( ! getPreference( 'core/edit-site', 'welcomeGuideTemplate' ) ) {
			createSuccessNotice(
				__(
					'Editing template. Changes made here affect all posts and pages that use the template.'
				),
				{ type: 'snackbar', actions: notificationAction }
			);
		}
	};

	const templateName = template
		? decodeEntities( template.title )
		: undefined;

	const previewContent = !! blocks?.length && (
		<BlockPreview.Async>
			<BlockPreview blocks={ blocks } />
		</BlockPreview.Async>
	);

	return (
		<>
			<PanelBody
				title={
					template
						? sprintf(
								/* translators: %s: template name */
								__( 'Template: %s' ),
								templateName
							)
						: __( 'Template' )
				}
				initialOpen={ false }
			>
				<VStack>
					{ ! templateId && (
						<WCText>
							{ __(
								'This page uses a classic template. To edit this template with blocks, create a block template.'
							) }
						</WCText>
					) }
					{ template && previewContent && (
						<div className="editor-template-actions-panel__preview">
							{ previewContent }
						</div>
					) }
					<HStack>
						{ template && onNavigateToEntityRecord && (
							<Button
								className="editor-template-actions-panel__action"
								__next40pxDefaultSize
								variant="secondary"
								onClick={ () => {
									onNavigateToEntityRecord( {
										postId: template.id,
										postType: 'wp_template',
									} );
									mayShowTemplateEditNotice();
								} }
							>
								{ __( 'Edit' ) }
							</Button>
						) }
						{ canCreateTemplate && (
							<Button
								className="editor-template-actions-panel__action"
								__next40pxDefaultSize
								variant="secondary"
								onClick={ () => setIsCreateModalOpen( true ) }
							>
								{ ! templateId
									? __( 'Create block template' )
									: __( 'Create new' ) }
							</Button>
						) }
					</HStack>
				</VStack>
			</PanelBody>
			{ isCreateModalOpen && (
				<CreateNewTemplateModal
					onClose={ () => setIsCreateModalOpen( false ) }
				/>
			) }
		</>
	);
}
