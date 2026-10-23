import { useEffect } from '@/lib/gutenberg/element';
import { useSelect } from '@/stores/gutenberg/data';
import { store as editorStore } from '@/components/gutenberg/editor';

export default function MetaBoxVisibility( { id } ) {
	const isVisible = useSelect(
		( select ) => {
			return select( editorStore ).isEditorPanelEnabled(
				`meta-box-${ id }`
			);
		},
		[ id ]
	);

	useEffect( () => {
		const element = document.getElementById( id );
		if ( ! element ) {
			return;
		}

		if ( isVisible ) {
			element.classList.remove( 'is-hidden' );
		} else {
			element.classList.add( 'is-hidden' );
		}
	}, [ id, isVisible ] );

	return null;
}
