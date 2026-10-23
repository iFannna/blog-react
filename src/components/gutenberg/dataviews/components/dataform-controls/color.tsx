import { colord } from 'colord';
import {
	Button,
	ColorIndicator,
	ColorPicker,
	Dropdown,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
} from '@/components/gutenberg/ui';
import {
	InputLayout,
	// eslint-disable-next-line @wordpress/use-recommended-components
	ValidatedInputControl,
} from '@/components/gutenberg/design-system';
import { useCallback } from '@/lib/gutenberg/element';
import { __ } from '@/lib/gutenberg/i18n';
import type { DataFormControlProps } from '../../types';
import getCustomValidity from './utils/get-custom-validity';

const ColorPickerDropdown = ( {
	color,
	onColorChange,
	disabled,
}: {
	color: string;
	onColorChange: ( newColor: string ) => void;
	disabled?: boolean;
} ) => {
	const validColor = color && colord( color ).isValid() ? color : '#ffffff';

	return (
		<Dropdown
			className="dataviews-controls__color-picker-dropdown"
			popoverProps={ { resize: false } }
			renderToggle={ ( { onToggle } ) => (
				<Button
					onClick={ onToggle }
					aria-label={ __( 'Open color picker' ) }
					size="small"
					disabled={ disabled }
					accessibleWhenDisabled
					icon={ () => <ColorIndicator colorValue={ validColor } /> }
				/>
			) }
			renderContent={ () => (
				<DropdownContentWrapper paddingSize="none">
					<ColorPicker
						color={ validColor }
						onChange={ onColorChange }
						enableAlpha
					/>
				</DropdownContentWrapper>
			) }
		/>
	);
};

export default function Color< Item >( {
	data,
	field,
	onChange,
	hideLabelFromVision,
	markWhenOptional,
	validity,
}: DataFormControlProps< Item > ) {
	const { label, placeholder, description, setValue, isValid } = field;
	const disabled = field.isDisabled( { item: data, field } );
	const value = field.getValue( { item: data } ) || '';

	const handleColorChange = useCallback(
		( newColor: string ) => {
			onChange( setValue( { item: data, value: newColor } ) );
		},
		[ data, onChange, setValue ]
	);

	const handleInputChange = useCallback(
		( newValue: string | undefined ) => {
			onChange( setValue( { item: data, value: newValue || '' } ) );
		},
		[ data, onChange, setValue ]
	);

	return (
		<ValidatedInputControl
			required={ !! field.isValid?.required }
			markWhenOptional={ markWhenOptional }
			customValidity={ getCustomValidity( isValid, validity ) }
			label={ label }
			placeholder={ placeholder }
			value={ value }
			description={
				typeof description === 'string' ? description : undefined
			}
			details={
				typeof description === 'string' ? undefined : description
			}
			onValueChange={ handleInputChange }
			hideLabelFromVision={ hideLabelFromVision }
			type="text"
			disabled={ disabled }
			prefix={
				<InputLayout.Slot padding="minimal">
					<ColorPickerDropdown
						color={ value }
						onColorChange={ handleColorChange }
						disabled={ disabled }
					/>
				</InputLayout.Slot>
			}
		/>
	);
}
