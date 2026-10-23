import type { Field } from '@/components/gutenberg/dataviews';
import { __ } from '@/lib/gutenberg/i18n';
import type { BasePost } from '../../types';
import ReadingSettingsLink from '../../../components/reading-settings-link';

const readingSettingsField: Field< BasePost > = {
	id: 'reading_settings',
	type: 'text',
	label: __( 'Reading settings' ),
	readOnly: true,
	enableSorting: false,
	render: ReadingSettingsLink,
	isVisible: ( item ) => item.slug === 'front-page',
};

export default readingSettingsField;
