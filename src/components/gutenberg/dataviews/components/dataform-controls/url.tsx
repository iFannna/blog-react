import { Icon, InputLayout } from '@/components/gutenberg/design-system';
import { link } from '@/components/gutenberg/icons';
import type { DataFormControlProps } from '../../types';
import ValidatedText from './utils/validated-input';

export default function Url< Item >( {
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
				type: 'url',
				prefix: (
					<InputLayout.Slot padding="minimal">
						<Icon icon={ link } />
					</InputLayout.Slot>
				),
			} }
		/>
	);
}
