import { __, _x, sprintf } from '@/lib/gutenberg/i18n';
import type { Attachment, Updatable } from '@/stores/gutenberg/core-data';
import type { Field } from '@/components/gutenberg/dataviews';

const mediaDimensionsField: Partial< Field< Updatable< Attachment > > > = {
	id: 'media_dimensions',
	type: 'text',
	label: __( 'Dimensions' ),
	getValue: ( { item } ) =>
		item?.media_details?.width && item?.media_details?.height
			? sprintf(
					// translators: 1: Width. 2: Height.
					_x( '%1$s × %2$s', 'image dimensions' ),
					item?.media_details?.width?.toString(),
					item?.media_details?.height?.toString()
				)
			: '',
	isVisible: ( item ) => {
		return !! ( item?.media_details?.width && item?.media_details?.height );
	},
	enableSorting: false,
	filterBy: false,
	readOnly: true,
};

export default mediaDimensionsField;
