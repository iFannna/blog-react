import { Drawer as _Drawer } from '@base-ui/react/drawer';
import { forwardRef } from '@/lib/gutenberg/element';
import { __ } from '@/lib/gutenberg/i18n';
import { close } from '@/components/gutenberg/icons';
import { IconButton } from '../icon-button';
import type { CloseIconButtonProps } from './types';

/**
 * Renders an icon button that closes the drawer when clicked.
 * Provides a default close icon and accessible label.
 */
const CloseIconButton = forwardRef< HTMLButtonElement, CloseIconButtonProps >(
	function DrawerCloseIconButton( { icon, label, ...props }, ref ) {
		return (
			<_Drawer.Close
				ref={ ref }
				render={
					<IconButton
						variant="minimal"
						size="compact"
						tone="neutral"
						{ ...props }
						icon={ icon ?? close }
						label={ label ?? __( 'Close' ) }
						data-wp-ui-drawer-close-icon=""
					/>
				}
			/>
		);
	}
);

export { CloseIconButton };
