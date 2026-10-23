import { __ } from '@/lib/gutenberg/i18n';
import type { Attachment, Updatable } from '@/stores/gutenberg/core-data';
import type { Field } from '@/components/gutenberg/dataviews';
import { getRawContent } from '../utils/get-raw-content';

const captionField: Partial< Field< Updatable< Attachment > > > = {
	id: 'caption',
	type: 'text',
	label: __( 'Caption' ),
	getValue: ( { item } ) => getRawContent( item?.caption ),
	render: ( { item } ) => getRawContent( item?.caption ) || '-',
	Edit: {
		control: 'textarea',
		rows: 2,
	},
	enableSorting: false,
	filterBy: false,
};

export default captionField;
