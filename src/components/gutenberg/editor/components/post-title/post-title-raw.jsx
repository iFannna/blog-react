import clsx from 'clsx';
import { TextareaControl as WCTextareaControl } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { decodeEntities } from '@/utils/gutenberg/html-entities';
import { useSelect } from '@/stores/gutenberg/data';
import { store as blockEditorStore } from '@/components/gutenberg/block-editor';
import { useState, forwardRef } from '@/lib/gutenberg/element';
import { DEFAULT_CLASSNAMES, REGEXP_NEWLINES } from './constants';
import usePostTitleFocus from './use-post-title-focus';
import usePostTitle from './use-post-title';

/**
 * Renders a raw post title input field.
 *
 * @param {Object}  _            Unused parameter.
 * @param {Element} forwardedRef Reference to the component's DOM node.
 *
 * @return {React.ReactNode} The rendered component.
 */
function PostTitleRaw( _, forwardedRef ) {
	const { placeholder } = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		const { titlePlaceholder } = getSettings();

		return {
			placeholder: titlePlaceholder,
		};
	}, [] );

	const [ isSelected, setIsSelected ] = useState( false );

	const { title, setTitle: onUpdate } = usePostTitle();
	const { ref: focusRef } = usePostTitleFocus( forwardedRef );

	function onChange( value ) {
		onUpdate( value.replace( REGEXP_NEWLINES, ' ' ) );
	}

	function onSelect() {
		setIsSelected( true );
	}

	function onUnselect() {
		setIsSelected( false );
	}

	// The wp-block className is important for editor styles.
	// This same block is used in both the visual and the code editor.
	const className = clsx( DEFAULT_CLASSNAMES, {
		'is-selected': isSelected,
		'is-raw-text': true,
	} );

	const decodedPlaceholder =
		decodeEntities( placeholder ) || __( 'Add title' );

	return (
		<WCTextareaControl
			ref={ focusRef }
			value={ title }
			onChange={ onChange }
			onFocus={ onSelect }
			onBlur={ onUnselect }
			label={ placeholder }
			className={ className }
			placeholder={ decodedPlaceholder }
			hideLabelFromVision
			autoComplete="off"
			dir="auto"
			rows={ 1 }
		/>
	);
}

export default forwardRef( PostTitleRaw );
