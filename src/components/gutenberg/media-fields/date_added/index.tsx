import { __ } from '@/lib/gutenberg/i18n';
import type { Field } from '@/components/gutenberg/dataviews';
import type { MediaItem } from '../types';

const dateAddedField: Partial< Field< MediaItem > > = {
	id: 'date',
	type: 'datetime',
	label: __( 'Date added' ),
	filterBy: {
		operators: [ 'before', 'after' ],
	},
	readOnly: true,
};

export default dateAddedField;
