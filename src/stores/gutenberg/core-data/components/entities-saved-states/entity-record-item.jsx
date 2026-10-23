import {
	CheckboxControl as WCCheckboxControl,
	PanelRow,
} from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { useSelect } from '@/stores/gutenberg/data';
import { decodeEntities } from '@/utils/gutenberg/html-entities';
import { STORE_NAME } from '../../name';
import { getTemplateInfo } from '../../utils/get-template-info';

export default function EntityRecordItem( { record, checked, onChange } ) {
	const { name, kind, title, key } = record;

	// Handle templates that might use default descriptive titles.
	const { entityRecordTitle } = useSelect(
		( select ) => {
			if ( 'postType' !== kind || 'wp_template' !== name ) {
				return {
					entityRecordTitle: title,
				};
			}

			const template = select( STORE_NAME ).getEditedEntityRecord(
				kind,
				name,
				key
			);

			const { default_template_types: templateTypes = [] } =
				select( STORE_NAME ).getCurrentTheme() ?? {};

			return {
				entityRecordTitle: getTemplateInfo( {
					template,
					templateTypes,
				} ).title,
			};
		},
		[ name, kind, title, key ]
	);

	return (
		<>
			<PanelRow>
				<WCCheckboxControl
					label={
						decodeEntities( entityRecordTitle ) || __( 'Untitled' )
					}
					checked={ checked }
					onChange={ onChange }
					className="entities-saved-states__change-control"
				/>
			</PanelRow>
		</>
	);
}
