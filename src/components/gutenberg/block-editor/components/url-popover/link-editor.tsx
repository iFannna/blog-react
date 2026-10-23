import clsx from 'clsx';
import { __ } from '@/lib/gutenberg/i18n';
import { Button } from '@/components/gutenberg/ui';
import { keyboardReturn } from '@/components/gutenberg/icons';
import URLInput from '../url-input';
import type { URLPopoverLinkEditorProps } from './types';

export default function LinkEditor( {
	autocompleteRef,
	className,
	onChangeInputValue,
	value,
	...props
}: URLPopoverLinkEditorProps ) {
	return (
		<form
			className={ clsx(
				'block-editor-url-popover__link-editor',
				className
			) }
			{ ...props }
		>
			<URLInput
				value={ value }
				onChange={ onChangeInputValue }
				autocompleteRef={ autocompleteRef }
			/>
			<Button
				icon={ keyboardReturn }
				label={ __( 'Apply' ) }
				type="submit"
				size="compact"
			/>
		</form>
	);
}
