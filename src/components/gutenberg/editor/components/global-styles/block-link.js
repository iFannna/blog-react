import { useSelect } from '@/stores/gutenberg/data';
import { useEffect } from '@/lib/gutenberg/element';
import { store as blockEditorStore } from '@/components/gutenberg/block-editor';
import { usePrevious } from '@/hooks/gutenberg/compose';

/**
 * Auto-navigate to block styles when a block is selected in the canvas.
 *
 * @param {Object}   props
 * @param {string}   props.path         Current navigation path.
 * @param {Function} props.onPathChange Callback to change the navigation path.
 */
export function GlobalStylesBlockLink( { path, onPathChange } ) {
	const { selectedBlockName, selectedBlockClientId } = useSelect(
		( select ) => {
			const { getSelectedBlockClientId, getBlockName } =
				select( blockEditorStore );
			const clientId = getSelectedBlockClientId();
			return {
				selectedBlockName: getBlockName( clientId ),
				selectedBlockClientId: clientId,
			};
		},
		[]
	);

	// const blockHasGlobalStyles = useBlockHasGlobalStyles( selectedBlockName );
	const blockHasGlobalStyles = true;
	const previousBlockClientId = usePrevious( selectedBlockClientId );

	// When we're in the `Blocks` screen enable deep linking to the selected block.
	useEffect( () => {
		// Only navigate when block selection changes, not when path changes
		if ( selectedBlockClientId === previousBlockClientId ) {
			return;
		}
		if ( ! selectedBlockClientId || ! blockHasGlobalStyles ) {
			return;
		}
		if (
			! path ||
			( path !== '/blocks' && ! path.startsWith( '/blocks/' ) ) ||
			path.startsWith( '/blocks/elements/' )
		) {
			return;
		}
		const newPath = '/blocks/' + encodeURIComponent( selectedBlockName );
		// Avoid navigating to the same path. This can happen when selecting
		// a new block of the same type.
		if ( newPath !== path ) {
			onPathChange?.( newPath );
		}
	}, [
		selectedBlockClientId,
		previousBlockClientId,
		selectedBlockName,
		blockHasGlobalStyles,
		path,
		onPathChange,
	] );

	return null;
}
