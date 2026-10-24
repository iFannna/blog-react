import clsx from 'clsx';
import { forwardRef } from '@/lib/gutenberg/element';

/**
 * Type definitions
 */
type NavigableRegionProps = {
	children: React.ReactNode;
	className?: string;
	ariaLabel: string;
	as?: React.ElementType;
	// Forwarded to the rendered element, so their types are open-ended.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[ key: string ]: any;
};

// This is a copy of the private `NavigableRegion` component from the '@wordpress/editor' private APIs.
const NavigableRegion = forwardRef< HTMLElement, NavigableRegionProps >(
	( { children, className, ariaLabel, as: Tag = 'div', ...props }, ref ) => {
		return (
			<Tag
				ref={ ref }
				className={ clsx( 'interface-navigable-region', className ) }
				aria-label={ ariaLabel }
				role="region"
				tabIndex="-1"
				{ ...props }
			>
				{ children }
			</Tag>
		);
	}
);

NavigableRegion.displayName = 'NavigableRegion';

export default NavigableRegion;
