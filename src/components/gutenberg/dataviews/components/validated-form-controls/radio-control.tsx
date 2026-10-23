import { forwardRef, useRef } from '@/lib/gutenberg/element';
import { useMergeRefs } from '@/hooks/gutenberg/compose';
import { RadioControl } from '@/components/gutenberg/ui';
import {
	// eslint-disable-next-line @wordpress/use-recommended-components
	ControlWithError,
} from '@/components/gutenberg/design-system';
import type { ValidatedControlProps } from './types';

type RadioControlProps = React.ComponentProps< typeof RadioControl >;

type ValidatedRadioControlProps = RadioControlProps & ValidatedControlProps;

const UnforwardedValidatedRadioControl = (
	{
		required,
		customValidity,
		markWhenOptional,
		...restProps
	}: ValidatedRadioControlProps,
	forwardedRef: React.ForwardedRef< HTMLDivElement >
) => {
	const validityTargetRef = useRef< HTMLDivElement >( null );
	const mergedRefs = useMergeRefs( [ forwardedRef, validityTargetRef ] );

	return (
		<ControlWithError
			className="dataviews-validated-control"
			required={ required }
			markWhenOptional={ markWhenOptional }
			// TODO: Upstream limitation - RadioControl does not accept a ref.
			ref={ mergedRefs }
			customValidity={ customValidity }
			getValidityTarget={ () =>
				validityTargetRef.current?.querySelector< HTMLInputElement >(
					'input[type="radio"]'
				)
			}
		>
			<RadioControl { ...restProps } />
		</ControlWithError>
	);
};

export const ValidatedRadioControl: React.ForwardRefExoticComponent<
	React.PropsWithoutRef< ValidatedRadioControlProps > &
		React.RefAttributes< HTMLDivElement >
> = forwardRef( UnforwardedValidatedRadioControl );
ValidatedRadioControl.displayName = 'ValidatedRadioControl';
