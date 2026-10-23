import { useDispatch, useSelect } from '@/stores/gutenberg/data';
import { store as blockEditorStore } from '@/components/gutenberg/block-editor';
import { MenuItem } from '@/components/gutenberg/ui';
import { createBlock } from '@/lib/gutenberg/blocks';
import { __ } from '@/lib/gutenberg/i18n';
import { useState } from '@/lib/gutenberg/element';
import { store as noticesStore } from '@/stores/gutenberg/notices';
import { symbolFilled } from '@/components/gutenberg/icons';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { privateApis as patternsPrivateApis } from '@/components/gutenberg/patterns';
import { unlock } from '../../lock-unlock';

const { CreateTemplatePartModal } = unlock( patternsPrivateApis );

export default function ConvertToTemplatePart( { clientIds, blocks } ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const { replaceBlocks } = useDispatch( blockEditorStore );
	const { createSuccessNotice } = useDispatch( noticesStore );

	const clientId = clientIds?.[ 0 ];
	const { isBlockBasedTheme, canCreate } = useSelect(
		( select ) => {
			const { getBlockRootClientId, canInsertBlockType } =
				select( blockEditorStore );

			const rootClientId = clientId
				? getBlockRootClientId( clientId )
				: undefined;

			return {
				isBlockBasedTheme:
					select( coreStore ).getCurrentTheme()?.is_block_theme,
				canCreate: canInsertBlockType(
					'core/template-part',
					rootClientId
				),
			};
		},
		[ clientId ]
	);

	if ( ! isBlockBasedTheme || ! canCreate ) {
		return null;
	}

	const onConvert = async ( templatePart ) => {
		replaceBlocks(
			clientIds,
			createBlock( 'core/template-part', {
				slug: templatePart.slug,
				theme: templatePart.theme,
			} )
		);
		createSuccessNotice( __( 'Template part created.' ), {
			type: 'snackbar',
		} );

		// The modal and this component will be unmounted because of `replaceBlocks` above,
		// so no need to call `closeModal` or `onClose`.
	};

	return (
		<>
			<MenuItem
				icon={ symbolFilled }
				onClick={ () => {
					setIsModalOpen( true );
				} }
				aria-expanded={ isModalOpen }
				aria-haspopup="dialog"
			>
				{ __( 'Create template part' ) }
			</MenuItem>
			{ isModalOpen && (
				<CreateTemplatePartModal
					closeModal={ () => {
						setIsModalOpen( false );
					} }
					blocks={ blocks }
					onCreate={ onConvert }
				/>
			) }
		</>
	);
}
