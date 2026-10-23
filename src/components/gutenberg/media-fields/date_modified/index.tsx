import { __ } from '@/lib/gutenberg/i18n';
import type { Field } from '@/components/gutenberg/dataviews';
import type { MediaItem } from '../types';

const dateModifiedField: Partial< Field< MediaItem > > = {
	id: 'modified',
	type: 'datetime',
	label: __( 'Date modified' ),
	filterBy: {
		operators: [ 'before', 'after' ],
	},
	readOnly: true,
};

export default dateModifiedField;
