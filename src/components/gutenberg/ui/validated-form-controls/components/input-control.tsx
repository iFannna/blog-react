import { forwardRef, useRef } from '@/lib/gutenberg/element';
import { useMergeRefs } from '@/hooks/gutenberg/compose';
import deprecated from '@/utils/gutenberg/deprecated';
import { ControlWithError } from '@/components/gutenberg/design-system';
import type { ValidatedControlProps } from './types';
import InputControl from '../../input-control';

const UnforwardedValidatedInputControl = (
	{
		required,
		customValidity,
		markWhenOptional,
		...restProps
	}: React.ComponentProps< typeof InputControl > & ValidatedControlProps,
	forwardedRef: React.ForwardedRef< HTMLInputElement >
) => {
	deprecated( 'wp.components.privateApis.ValidatedInputControl', {
		since: '7.2',
		alternative: 'ValidatedInputControl from @wordpress/ui',
		hint: 'This private API will be completely removed within a few Gutenberg plugin releases.',
	} );

	const validityTargetRef = useRef< HTMLInputElement >( null );
	const mergedRefs = useMergeRefs( [ forwardedRef, validityTargetRef ] );

	return (
		<ControlWithError
			className="components-validated-control"
			required={ required }
			markWhenOptional={ markWhenOptional }
			customValidity={ customValidity }
			getValidityTarget={ () => validityTargetRef.current }
		>
			<InputControl ref={ mergedRefs } { ...restProps } />
		</ControlWithError>
	);
};

export const ValidatedInputControl = forwardRef(
	UnforwardedValidatedInputControl
);
ValidatedInputControl.displayName = 'ValidatedInputControl';
