import { Icon, InputLayout } from '@/components/gutenberg/design-system';
import { mobile } from '@/components/gutenberg/icons';
import type { DataFormControlProps } from '../../types';
import ValidatedText from './utils/validated-input';

export default function Telephone< Item >( {
	data,
	field,
	onChange,
	hideLabelFromVision,
	markWhenOptional,
	validity,
}: DataFormControlProps< Item > ) {
	return (
		<ValidatedText
			{ ...{
				data,
				field,
				onChange,
				hideLabelFromVision,
				markWhenOptional,
				validity,
				type: 'tel',
				prefix: (
					<InputLayout.Slot padding="minimal">
						<Icon icon={ mobile } />
					</InputLayout.Slot>
				),
			} }
		/>
	);
}
