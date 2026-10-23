import { forwardRef, useRef } from '@/lib/gutenberg/element';
import { useMergeRefs } from '@/hooks/gutenberg/compose';
import { ToggleControl } from '@/components/gutenberg/ui';
import {
	// eslint-disable-next-line @wordpress/use-recommended-components
	ControlWithError,
} from '@/components/gutenberg/design-system';
import type { ValidatedControlProps } from './types';

type ToggleControlProps = React.ComponentProps< typeof ToggleControl >;

type ValidatedToggleControlProps = ToggleControlProps & ValidatedControlProps;

// TODO: Should we customize the default `missingValue` message? It says to "check this box".

const UnforwardedValidatedToggleControl = (
	{
		required,
		customValidity,
		markWhenOptional,
		...restProps
	}: ValidatedToggleControlProps,
	forwardedRef: React.ForwardedRef< HTMLInputElement >
) => {
	const validityTargetRef = useRef< HTMLInputElement >( null );
	const mergedRefs = useMergeRefs( [ forwardedRef, validityTargetRef ] );

	return (
		<ControlWithError
			className="dataviews-validated-control"
			required={ required }
			markWhenOptional={ markWhenOptional }
			customValidity={ customValidity }
			getValidityTarget={ () => validityTargetRef.current }
		>
			<ToggleControl
				ref={ mergedRefs }
				required={ required }
				{ ...restProps }
			/>
		</ControlWithError>
	);
};

export const ValidatedToggleControl: React.ForwardRefExoticComponent<
	React.PropsWithoutRef< ValidatedToggleControlProps > &
		React.RefAttributes< HTMLInputElement >
> = forwardRef( UnforwardedValidatedToggleControl );
ValidatedToggleControl.displayName = 'ValidatedToggleControl';
