import type { ToggleControl } from '@/components/gutenberg/ui';

type ToggleControlProps = Parameters< typeof ToggleControl >[ 0 ];
export type BaseOptionProps = Pick<
	ToggleControlProps,
	'help' | 'label' | 'onChange'
> & { isChecked?: ToggleControlProps[ 'checked' ]; children?: React.ReactNode };
