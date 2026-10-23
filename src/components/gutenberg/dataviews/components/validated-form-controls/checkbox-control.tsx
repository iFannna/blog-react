import { forwardRef, useRef } from '@/lib/gutenberg/element';
import { useMergeRefs } from '@/hooks/gutenberg/compose';
import { CheckboxControl as WCCheckboxControl } from '@/components/gutenberg/ui';
import {
	// eslint-disable-next-line @wordpress/use-recommended-components
	ControlWithError,
} from '@/components/gutenberg/design-system';
import type { ValidatedControlProps } from './types';

type CheckboxControlProps = React.ComponentProps< typeof WCCheckboxControl >;

type ValidatedCheckboxControlProps = CheckboxControlProps &
	ValidatedControlProps;

const UnforwardedValidatedCheckboxControl = (
	{
		required,
		customValidity,
		markWhenOptional,
		...restProps
	}: ValidatedCheckboxControlProps,
	forwardedRef: React.ForwardedRef< HTMLInputElement >
) => {
	const validityTargetRef = useRef< HTMLDivElement >( null );
	const mergedRefs = useMergeRefs( [ forwardedRef, validityTargetRef ] );

	return (
		<ControlWithError
			className="dataviews-validated-control"
			required={ required }
			markWhenOptional={ markWhenOptional }
			ref={ mergedRefs }
			customValidity={ customValidity }
			getValidityTarget={ () =>
				validityTargetRef.current?.querySelector< HTMLInputElement >(
					'input[type="checkbox"]'
				)
			}
		>
			<WCCheckboxControl
				// TODO: Upstream limitation - CheckboxControl doesn't support uncontrolled mode, visually.
				{ ...restProps }
			/>
		</ControlWithError>
	);
};

export const ValidatedCheckboxControl: React.ForwardRefExoticComponent<
	React.PropsWithoutRef< ValidatedCheckboxControlProps > &
		React.RefAttributes< HTMLInputElement >
> = forwardRef( UnforwardedValidatedCheckboxControl );
ValidatedCheckboxControl.displayName = 'ValidatedCheckboxControl';
