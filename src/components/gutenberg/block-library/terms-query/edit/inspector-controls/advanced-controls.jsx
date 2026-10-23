import { __ } from '@/lib/gutenberg/i18n';
import {
	InspectorControls,
	privateApis as blockEditorPrivateApis,
} from '@/components/gutenberg/block-editor';
import { unlock } from '../../../lock-unlock';

const { HTMLElementControl } = unlock( blockEditorPrivateApis );

export default function AdvancedControls( {
	TagName,
	setAttributes,
	clientId,
} ) {
	return (
		<InspectorControls group="advanced">
			<HTMLElementControl
				tagName={ TagName }
				onChange={ ( value ) => setAttributes( { tagName: value } ) }
				clientId={ clientId }
				options={ [
					{ label: __( 'Default (<div>)' ), value: 'div' },
					{ label: '<main>', value: 'main' },
					{ label: '<section>', value: 'section' },
					{ label: '<aside>', value: 'aside' },
				] }
			/>
		</InspectorControls>
	);
}
