import { __ } from '@/lib/gutenberg/i18n';
import { useEffect, useRef, useState } from '@/lib/gutenberg/element';
import { useSelect } from '@/stores/gutenberg/data';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { Button, Modal } from '@/components/gutenberg/ui';
import { Stack } from '@/components/gutenberg/design-system';

/**
 * Asks for confirmation before reloading the editor when the post has unsaved
 * changes. Reload shortcuts are intercepted because the native browser prompt
 * cannot be restyled.
 *
 * @return {React.ReactNode} The confirmation modal, or null when it is closed.
 */
export default function UnsavedChangesWarning() {
	const { __experimentalGetDirtyEntityRecords } = useSelect( coreStore );
	const [ isOpen, setIsOpen ] = useState( false );
	const bypassUnloadWarningRef = useRef( false );

	// Browser actions the page cannot intercept (reload button, tab close,
	// history navigation) can only be guarded by the native prompt.
	useEffect( () => {
		const warnIfUnsavedChanges = ( event ) => {
			if ( bypassUnloadWarningRef.current ) {
				return;
			}
			if ( __experimentalGetDirtyEntityRecords().length === 0 ) {
				return;
			}
			event.preventDefault();
			event.returnValue = '';
		};

		window.addEventListener( 'beforeunload', warnIfUnsavedChanges );

		return () => {
			window.removeEventListener( 'beforeunload', warnIfUnsavedChanges );
		};
	}, [ __experimentalGetDirtyEntityRecords ] );

	useEffect( () => {
		/**
		 * @param {KeyboardEvent} event Keydown event.
		 */
		const handleKeyDown = ( event ) => {
			const isReloadShortcut =
				event.key === 'F5' ||
				( ! event.altKey &&
					( event.ctrlKey || event.metaKey ) &&
					event.key.toLowerCase() === 'r' );
			if ( ! isReloadShortcut ) {
				return;
			}

			// Read the selector directly so the decision uses the latest edits.
			if ( __experimentalGetDirtyEntityRecords().length === 0 ) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			setIsOpen( true );
		};

		const documents = new Set();
		const boundFrames = new WeakSet();
		let isActive = true;

		const bindDocument = ( doc ) => {
			if ( ! doc || documents.has( doc ) ) {
				return;
			}
			documents.add( doc );
			doc.addEventListener( 'keydown', handleKeyDown, true );
		};

		const bindFrame = ( frame ) => {
			if ( ! isActive ) {
				return;
			}

			let doc;
			try {
				doc = frame.contentDocument;
			} catch {
				return;
			}
			bindDocument( doc );

			if ( ! boundFrames.has( frame ) ) {
				boundFrames.add( frame );
				// The document is replaced when the frame navigates or reloads.
				frame.addEventListener( 'load', () => bindFrame( frame ) );
			}
		};

		const bindFramesWithin = ( root ) => {
			root.querySelectorAll( 'iframe' ).forEach( bindFrame );
		};

		bindDocument( document );
		bindFramesWithin( document );

		// The canvas iframe mounts and unmounts with the editor mode, and
		// keyboard events from its document never reach the parent document.
		const observer = new MutationObserver( ( records ) => {
			for ( const record of records ) {
				for ( const node of record.addedNodes ) {
					if ( node.nodeType !== Node.ELEMENT_NODE ) {
						continue;
					}
					if ( node.tagName === 'IFRAME' ) {
						bindFrame( node );
					} else {
						bindFramesWithin( node );
					}
				}
			}
		} );
		observer.observe( document.body, { childList: true, subtree: true } );

		return () => {
			isActive = false;
			observer.disconnect();
			documents.forEach( ( doc ) => {
				doc.removeEventListener( 'keydown', handleKeyDown, true );
			} );
		};
	}, [ __experimentalGetDirtyEntityRecords ] );

	if ( ! isOpen ) {
		return null;
	}

	return (
		<Modal
			title={ __( 'Reload site?' ) }
			onRequestClose={ () => setIsOpen( false ) }
			closeButtonLabel={ __( 'Cancel' ) }
			className="editor-reload-warning-modal"
		>
			<p>{ __( 'Your changes may not be saved.' ) }</p>
			<Stack direction="row" gap="sm" justify="flex-end">
				<Button variant="tertiary" onClick={ () => setIsOpen( false ) }>
					{ __( 'Cancel' ) }
				</Button>
				<Button
					variant="primary"
					onClick={ () => {
						bypassUnloadWarningRef.current = true;
						window.location.reload();
					} }
				>
					{ __( 'Reload' ) }
				</Button>
			</Stack>
		</Modal>
	);
}
