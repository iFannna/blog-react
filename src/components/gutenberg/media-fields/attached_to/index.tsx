import { __ } from '@/lib/gutenberg/i18n';
import type { Field } from '@/components/gutenberg/dataviews';
import type { MediaItem } from '../types';
import MediaAttachedToView from './view';
import MediaAttachedToEdit from './edit';

const attachedToField: Partial< Field< MediaItem > > = {
	id: 'attached_to',
	type: 'text',
	label: __( 'Attached to' ),
	Edit: MediaAttachedToEdit,
	render: MediaAttachedToView,
	enableSorting: false,
	filterBy: false,
};

export default attachedToField;
