import { Combobox as _Combobox } from '@base-ui/react/combobox';
import { forwardRef } from '@/lib/gutenberg/element';
import type { ComboboxChipsProps } from './types';

export const Chips = forwardRef< HTMLDivElement, ComboboxChipsProps >(
	function UnforwardedChips( props, ref ) {
		return <_Combobox.Chips ref={ ref } { ...props } />;
	}
);
