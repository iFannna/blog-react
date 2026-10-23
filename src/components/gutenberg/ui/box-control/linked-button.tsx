import { link, linkOff } from '@/components/gutenberg/icons';
import { __ } from '@/lib/gutenberg/i18n';
import Button from '../button';

export default function LinkedButton( {
	isLinked,
	...props
}: { isLinked?: boolean } & React.ComponentProps< typeof Button > ) {
	const label = isLinked ? __( 'Unlink sides' ) : __( 'Link sides' );

	return (
		<Button
			{ ...props }
			className="component-box-control__linked-button"
			size="small"
			icon={ isLinked ? link : linkOff }
			iconSize={ 24 }
			label={ label }
		/>
	);
}
