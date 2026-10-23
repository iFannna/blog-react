import { __ } from '@/lib/gutenberg/i18n';
import type { Attachment, Updatable } from '@/stores/gutenberg/core-data';
import type { Field } from '@/components/gutenberg/dataviews';

const mimeTypeField: Partial< Field< Updatable< Attachment > > > = {
	id: 'mime_type',
	type: 'text',
	label: __( 'File type' ),
	getValue: ( { item } ) => item?.mime_type || '',
	render: ( { item } ) => item?.mime_type || '-',
	// Disable sorting until REST API support for ordering my `mime_type` is added.
	// See: https://core.trac.wordpress.org/ticket/64073
	enableSorting: false,
	filterBy: false,
	readOnly: true,
};

export default mimeTypeField;
