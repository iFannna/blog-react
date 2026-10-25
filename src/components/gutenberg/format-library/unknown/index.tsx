import { __ } from '@/lib/gutenberg/i18n';
import { removeFormat, slice, isCollapsed } from '@/components/gutenberg/rich-text';
import { RichTextToolbarButton } from '@/components/gutenberg/block-editor';
import { help } from '@/components/gutenberg/icons';
import type { RichTextValue } from '@/components/gutenberg/rich-text';
import type { FormatEditProps } from '../types';

const name = 'core/unknown';
const title = __( 'Clear Unknown Formatting' );

function selectionContainsUnknownFormats( value: RichTextValue ) {
	if ( isCollapsed( value ) ) {
		return false;
	}

	const selectedValue = slice( value );
	return selectedValue.formats.some( ( formats ) => {
		return formats.some( ( format ) => format.type === name );
	} );
}

export const unknown = {
	name,
	title,
	tagName: '*',
	className: null,
	edit( { isActive, value, onChange, onFocus }: FormatEditProps ) {
		if ( ! isActive && ! selectionContainsUnknownFormats( value ) ) {
			return null;
		}

		function onClick() {
			onChange( removeFormat( value, name ) );
			onFocus();
		}

		return (
			<RichTextToolbarButton
				name="unknown"
				icon={ help }
				title={ title }
				onClick={ onClick }
				isActive
			/>
		);
	},
};
