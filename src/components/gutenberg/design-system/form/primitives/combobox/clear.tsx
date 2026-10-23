import { Combobox as _Combobox } from '@base-ui/react/combobox';
import { forwardRef } from '@/lib/gutenberg/element';
import { closeSmall } from '@/components/gutenberg/icons';
import { __ } from '@/lib/gutenberg/i18n';
import { IconButton } from '../../../icon-button';
import type { ComboboxClearProps } from './types';

const DEFAULT_RENDER = (
	{ 'aria-label': ariaLabel = __( 'Clear' ), ...props }: ComboboxClearProps,
	{ disabled }: _Combobox.Clear.State
) => (
	<IconButton
		icon={ closeSmall }
		focusableWhenDisabled={ false }
		disabled={ disabled }
		aria-hidden={ disabled || undefined }
		size="small"
		variant="minimal"
		tone="neutral"
		label={ ariaLabel }
		{ ...props }
	/>
);

/**
 * A button that clears the selected value(s).
 */
export const Clear = forwardRef< HTMLButtonElement, ComboboxClearProps >(
	function UnforwardedClear(
		{ render = DEFAULT_RENDER, ...restProps },
		ref
	) {
		return (
			<_Combobox.Clear ref={ ref } render={ render } { ...restProps } />
		);
	}
);
