import { useEvent } from '@/hooks/gutenberg/compose';
import { useEffect, useRef } from '@/lib/gutenberg/element';
import deprecated from '@/utils/gutenberg/deprecated';
import { useDispatch } from '@/stores/gutenberg/data';
import { store as blockEditorStore } from '@/components/gutenberg/block-editor';

/**
 * If a plugin is still using the old textAlign attribute, we need to migrate its value
 * to the new style.typography.textAlign attribute.
 *
 * @param {Object} props Block props.
 */
export default function useDeprecatedTextAlign( props ) {
	const { name, attributes, setAttributes } = props;
	const { textAlign } = attributes;
	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );
	const updateStyleWithAlign = useEvent( () => {
		deprecated( `textAlign attribute in ${ name }`, {
			alternative: 'style.typography.textAlign',
			since: '7.0',
		} );
		__unstableMarkNextChangeAsNotPersistent();
		setAttributes( ( currentAttr ) => ( {
			style: {
				...currentAttr.style,
				typography: {
					...currentAttr.style?.typography,
					textAlign,
				},
			},
		} ) );
	} );
	const lastUpdatedAlignRef = useRef();
	useEffect( () => {
		if ( textAlign === lastUpdatedAlignRef.current ) {
			return;
		}
		lastUpdatedAlignRef.current = textAlign;
		updateStyleWithAlign();
	}, [ textAlign, updateStyleWithAlign ] );
}
