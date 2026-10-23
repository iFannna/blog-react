import { __ } from '@/lib/gutenberg/i18n';
import { CheckboxControl as WCCheckboxControl } from '@/components/gutenberg/ui';
import { useDispatch, useSelect } from '@/stores/gutenberg/data';
import PostStickyCheck from './check';
import { store as editorStore } from '../../store';

/**
 * Renders the PostSticky component. It provides a checkbox control for the sticky post feature.
 *
 * @return {React.ReactNode} The rendered component.
 */
export default function PostSticky() {
	const postSticky = useSelect( ( select ) => {
		return (
			select( editorStore ).getEditedPostAttribute( 'sticky' ) ?? false
		);
	}, [] );
	const { editPost } = useDispatch( editorStore );

	return (
		<PostStickyCheck>
			<WCCheckboxControl
				className="editor-post-sticky__checkbox-control"
				label={ __( 'Sticky' ) }
				help={ __( 'Pin this post to the top of the blog.' ) }
				checked={ postSticky }
				onChange={ () => editPost( { sticky: ! postSticky } ) }
			/>
		</PostStickyCheck>
	);
}
