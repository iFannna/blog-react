import { VisuallyHidden } from '@/components/gutenberg/design-system';

export default function AccessibleDescription( { id, children } ) {
	return (
		<VisuallyHidden>
			<div id={ id } className="wp-block-navigation__description">
				{ children }
			</div>
		</VisuallyHidden>
	);
}
