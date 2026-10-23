import { __ } from '@/lib/gutenberg/i18n';
import type { Field } from '@/components/gutenberg/dataviews';
import type { MediaItem } from '../types';
import MediaThumbnailView from './view';

const mediaThumbnailField: Partial< Field< MediaItem > > = {
	id: 'media_thumbnail',
	type: 'media',
	label: __( 'Thumbnail' ),
	render: MediaThumbnailView,
	enableSorting: false,
	filterBy: false,
};

export default mediaThumbnailField;
