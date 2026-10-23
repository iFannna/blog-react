import clsx from 'clsx';
import { ExternalLink } from '@/components/gutenberg/ui';
import { safeDecodeURI, filterURLForDisplay } from '@/utils/gutenberg/url';
import type { URLPopoverLinkViewerURLProps } from './types';

export default function LinkViewerURL( {
	url,
	urlLabel,
	className,
}: URLPopoverLinkViewerURLProps ) {
	const linkClassName = clsx(
		className,
		'block-editor-url-popover__link-viewer-url'
	);

	if ( ! url ) {
		return <span className={ linkClassName }></span>;
	}

	return (
		<ExternalLink className={ linkClassName } href={ url }>
			{ urlLabel || filterURLForDisplay( safeDecodeURI( url ) ) }
		</ExternalLink>
	);
}
