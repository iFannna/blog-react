import { forwardRef, useEffect, useState } from '@/lib/gutenberg/element';
import { __ } from '@/lib/gutenberg/i18n';
import { speak } from '@/utils/gutenberg/a11y';
import type { ComponentPropsWithoutRef, ForwardedRef } from 'react';

function InserterListboxGroup(
	props: ComponentPropsWithoutRef< 'div' >,
	ref: ForwardedRef< HTMLDivElement >
) {
	const [ shouldSpeak, setShouldSpeak ] = useState( false );

	useEffect( () => {
		if ( shouldSpeak ) {
			speak(
				__( 'Use left and right arrow keys to move through blocks' )
			);
		}
	}, [ shouldSpeak ] );

	return (
		<div
			ref={ ref }
			role="listbox"
			aria-orientation="horizontal"
			onFocus={ () => {
				setShouldSpeak( true );
			} }
			onBlur={ ( event ) => {
				const focusingOutsideGroup = ! event.currentTarget.contains(
					event.relatedTarget
				);
				if ( focusingOutsideGroup ) {
					setShouldSpeak( false );
				}
			} }
			{ ...props }
		/>
	);
}

export default forwardRef( InserterListboxGroup );
