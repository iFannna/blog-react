import { __ } from '@/lib/gutenberg/i18n';
import { toggleFormat } from '@/components/gutenberg/rich-text';
import { RichTextToolbarButton } from '@/components/gutenberg/block-editor';
import { superscript as superscriptIcon } from '@/components/gutenberg/icons';
import type { FormatEditProps } from '../types';

const name = 'core/superscript';
const title = __( 'Superscript' );

export const superscript = {
	name,
	title,
	tagName: 'sup',
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
				icon={ superscriptIcon }
				title={ title }
				onClick={ onClick }
				isActive={ isActive }
				role="menuitemcheckbox"
			/>
		);
	},
};
