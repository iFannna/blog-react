import { __ } from '@/lib/gutenberg/i18n';
import { toggleFormat } from '@/components/gutenberg/rich-text';
import { RichTextToolbarButton } from '@/components/gutenberg/block-editor';
import { button } from '@/components/gutenberg/icons';
import type { FormatEditProps } from '../types';

const name = 'core/keyboard';
const title = __( 'Keyboard input' );

export const keyboard = {
	name,
	title,
	tagName: 'kbd',
	className: null,
	edit( { isActive, value, onChange, onFocus }: FormatEditProps ) {
		function onToggle() {
			onChange( toggleFormat( value, { type: name, title } ) );
		}

		function onClick() {
			onToggle();
			onFocus();
		}

		return (
			<RichTextToolbarButton
				icon={ button }
				title={ title }
				onClick={ onClick }
				isActive={ isActive }
				role="menuitemcheckbox"
			/>
		);
	},
};
