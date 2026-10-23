import { useMemo } from '@/lib/gutenberg/element';
import { getFilename } from '@/utils/gutenberg/url';
import type { DataViewRenderFieldProps } from '@/components/gutenberg/dataviews';
import { Tooltip } from '@/components/gutenberg/design-system';
import type { MediaItem } from '../types';

// Proxy threshold for "long enough that the cell will visually truncate" —
// used to decide whether to wrap the filename in a Tooltip showing the full
// name on hover. Visual truncation itself is handled in CSS.
const TRUNCATE_LENGTH = 15;

export default function FileNameView( {
	item,
}: DataViewRenderFieldProps< MediaItem > ) {
	const fileName = useMemo(
		() => ( item?.source_url ? getFilename( item.source_url ) : null ),
		[ item?.source_url ]
	);

	if ( ! fileName ) {
		return '';
	}

	if ( fileName.length <= TRUNCATE_LENGTH ) {
		return (
			<span className="dataviews-media-field__filename">
				{ fileName }
			</span>
		);
	}

	// The full filename is always in the DOM, so assistive tech gets it
	// regardless. The Tooltip aids mouse users where the cell visually clips
	// (DataViews layouts); in a non-truncating context like the DataForm the
	// name wraps in full, making it redundant but harmless.
	return (
		<Tooltip.Root>
			<Tooltip.Trigger
				render={
					<span className="dataviews-media-field__filename">
						{ fileName }
					</span>
				}
			/>
			<Tooltip.Popup>{ fileName }</Tooltip.Popup>
		</Tooltip.Root>
	);
}
