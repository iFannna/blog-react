import { __ } from '@/lib/gutenberg/i18n';
import { RangeControl } from '@/components/gutenberg/ui';

export default function MaxTermsControl( { value, onChange, ...props } ) {
	return (
		<RangeControl
			value={ value }
			min={ 0 }
			max={ 100 }
			onChange={ onChange }
			help={ __(
				'Limit the number of terms you want to show. To show all terms, use 0 (zero).'
			) }
			{ ...props }
		/>
	);
}
