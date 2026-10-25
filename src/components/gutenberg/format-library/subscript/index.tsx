import { __ } from '@/lib/gutenberg/i18n';
import { toggleFormat } from '@/components/gutenberg/rich-text';
import { RichTextToolbarButton } from '@/components/gutenberg/block-editor';
import { subscript as subscriptIcon } from '@/components/gutenberg/icons';
import type { FormatEditProps } from '../types';

const name = 'core/subscript';
const title = __( 'Subscript' );

export const subscript = {
	name,
	title,
	tagName: 'sub',
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
				icon={ subscriptIcon }
				title={ title }
				onClick={ onClick }
				isActive={ isActive }
				role="menuitemcheckbox"
			/>
		);
	},
};
