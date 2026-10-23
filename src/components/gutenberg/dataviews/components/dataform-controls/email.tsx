import { Icon, InputLayout } from '@/components/gutenberg/design-system';
import { envelope } from '@/components/gutenberg/icons';
import type { DataFormControlProps } from '../../types';
import ValidatedText from './utils/validated-input';

export default function Email< Item >( {
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
				type: 'email',
				prefix: (
					<InputLayout.Slot padding="minimal">
						<Icon icon={ envelope } />
					</InputLayout.Slot>
				),
			} }
		/>
	);
}
