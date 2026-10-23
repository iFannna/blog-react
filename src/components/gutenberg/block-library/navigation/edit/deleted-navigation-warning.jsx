import { Warning } from '@/components/gutenberg/block-editor';
import { Button, Notice } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { useState, createInterpolateElement } from '@/lib/gutenberg/element';

function DeletedNavigationWarning( { onCreateNew, isNotice = false } ) {
	const [ isButtonDisabled, setIsButtonDisabled ] = useState( false );

	const handleButtonClick = () => {
		setIsButtonDisabled( true );
		onCreateNew();
	};

	const message = createInterpolateElement(
		__(
			'Navigation Menu has been deleted or is unavailable. <button>Create a new Menu?</button>'
		),
		{
			button: (
				<Button
					__next40pxDefaultSize
					onClick={ handleButtonClick }
					variant="link"
					disabled={ isButtonDisabled }
					accessibleWhenDisabled
				/>
			),
		}
	);

	return isNotice ? (
		<Notice status="warning" isDismissible={ false }>
			{ message }
		</Notice>
	) : (
		<Warning>{ message }</Warning>
	);
}

export default DeletedNavigationWarning;
