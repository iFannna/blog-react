import { Button } from '@/components/gutenberg/ui';
import { link, linkOff } from '@/components/gutenberg/icons';
import { __ } from '@/lib/gutenberg/i18n';
import type { BorderRadiusLinkedButtonProps } from './types';

export default function LinkedButton( {
	isLinked,
	...props
}: BorderRadiusLinkedButtonProps ) {
	const label = isLinked ? __( 'Unlink radii' ) : __( 'Link radii' );

	return (
		<Button
			{ ...props }
			className="components-border-radius-control__linked-button"
			size="small"
			icon={ isLinked ? link : linkOff }
			iconSize={ 24 }
			label={ label }
		/>
	);
}
