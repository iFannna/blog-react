import { useSelect } from '@/stores/gutenberg/data';
import { useMemo } from '@/lib/gutenberg/element';
import { store as blocksStore } from '@/lib/gutenberg/blocks';
import {
	store as blockEditorStore,
	privateApis as blockEditorPrivateApis,
} from '@/components/gutenberg/block-editor';
import { PanelBody } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { unlock } from '../../lock-unlock';
import { TEMPLATE_PART_POST_TYPE } from '../../store/constants';
import { store as editorStore } from '../../store';

const { BlockQuickNavigation } = unlock( blockEditorPrivateApis );

function TemplatePartContentPanelInner() {
	const blockTypes = useSelect( ( select ) => {
		const { getBlockTypes } = select( blocksStore );
		return getBlockTypes();
	}, [] );
	const themeBlockNames = useMemo( () => {
		return blockTypes
			.filter( ( blockType ) => {
				return blockType.category === 'theme';
			} )
			.map( ( { name } ) => name );
	}, [ blockTypes ] );
	const themeBlocks = useSelect(
		( select ) => {
			const { getBlocksByName } = select( blockEditorStore );
			return getBlocksByName( themeBlockNames );
		},
		[ themeBlockNames ]
	);
	if ( themeBlocks.length === 0 ) {
		return null;
	}
	return (
		<PanelBody title={ __( 'Content' ) }>
			<BlockQuickNavigation clientIds={ themeBlocks } />
		</PanelBody>
	);
}

export default function TemplatePartContentPanel() {
	const postType = useSelect( ( select ) => {
		const { getCurrentPostType } = select( editorStore );
		return getCurrentPostType();
	}, [] );
	if ( postType !== TEMPLATE_PART_POST_TYPE ) {
		return null;
	}

	return <TemplatePartContentPanelInner />;
}
