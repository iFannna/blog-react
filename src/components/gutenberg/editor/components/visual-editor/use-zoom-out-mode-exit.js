import { useSelect, useDispatch } from '@/stores/gutenberg/data';
import { useRefEffect } from '@/hooks/gutenberg/compose';
import { store as blockEditorStore } from '@/components/gutenberg/block-editor';
import { unlock } from '../../lock-unlock';

/**
 * Allows Zoom Out mode to be exited by double clicking in the selected block.
 */
export function useZoomOutModeExit() {
	const { getSettings, isZoomOut } = unlock( useSelect( blockEditorStore ) );
	const { resetZoomLevel } = unlock( useDispatch( blockEditorStore ) );

	return useRefEffect(
		( node ) => {
			function onDoubleClick( event ) {
				if ( ! isZoomOut() ) {
					return;
				}

				if ( ! event.defaultPrevented ) {
					event.preventDefault();

					const { __experimentalSetIsInserterOpened } = getSettings();

					if (
						typeof __experimentalSetIsInserterOpened === 'function'
					) {
						__experimentalSetIsInserterOpened( false );
					}
					resetZoomLevel();
				}
			}

			node.addEventListener( 'dblclick', onDoubleClick );

			return () => {
				node.removeEventListener( 'dblclick', onDoubleClick );
			};
		},
		[ getSettings, isZoomOut, resetZoomLevel ]
	);
}
