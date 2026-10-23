import { __ } from '@/lib/gutenberg/i18n';
import { getFilename } from '@/utils/gutenberg/url';
import type { Field } from '@/components/gutenberg/dataviews';
import type { MediaItem } from '../types';
import FileNameView from './view';

const filenameField: Partial< Field< MediaItem > > = {
	id: 'filename',
	type: 'text',
	label: __( 'File name' ),
	getValue: ( { item }: { item: MediaItem } ) =>
		getFilename( item?.source_url || '' ),
	render: FileNameView,
	enableSorting: false,
	filterBy: false,
	readOnly: true,
};

export default filenameField;
