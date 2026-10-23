import { forwardRef, useRef } from '@/lib/gutenberg/element';
import { useMergeRefs } from '@/hooks/gutenberg/compose';
import { __experimentalNumberControl as NumberControl } from '@/components/gutenberg/ui';
import {
	// eslint-disable-next-line @wordpress/use-recommended-components
	ControlWithError,
} from '@/components/gutenberg/design-system';
import type { ValidatedControlProps } from './types';

type NumberControlProps = React.ComponentProps< typeof NumberControl >;

type ValidatedNumberControlProps = NumberControlProps & ValidatedControlProps;

const UnforwardedValidatedNumberControl = (
	{
		required,
		customValidity,
		markWhenOptional,
		...restProps
	}: ValidatedNumberControlProps,
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
			<NumberControl ref={ mergedRefs } { ...restProps } />
		</ControlWithError>
	);
};

export const ValidatedNumberControl: React.ForwardRefExoticComponent<
	React.PropsWithoutRef< ValidatedNumberControlProps > &
		React.RefAttributes< HTMLInputElement >
> = forwardRef( UnforwardedValidatedNumberControl );
ValidatedNumberControl.displayName = 'ValidatedNumberControl';
