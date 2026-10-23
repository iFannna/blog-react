import clsx from 'clsx';
import { __ } from '@/lib/gutenberg/i18n';
import { Button } from '@/components/gutenberg/ui';
import { pencil } from '@/components/gutenberg/icons';
import LinkViewerURL from './link-viewer-url';
import type { URLPopoverLinkViewerProps } from './types';

export default function LinkViewer( {
	className,
	linkClassName,
	onEditLinkClick,
	url,
	urlLabel,
	...props
}: URLPopoverLinkViewerProps ) {
	return (
		<div
			className={ clsx(
				'block-editor-url-popover__link-viewer',
				className
			) }
			{ ...props }
		>
			<LinkViewerURL
				url={ url }
				urlLabel={ urlLabel }
				className={ linkClassName }
			/>
			{ onEditLinkClick && (
				<Button
					icon={ pencil }
					label={ __( 'Edit' ) }
					onClick={ onEditLinkClick }
					size="compact"
				/>
			) }
		</div>
	);
}
