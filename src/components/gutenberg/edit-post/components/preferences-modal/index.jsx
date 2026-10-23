import { __ } from '@/lib/gutenberg/i18n';
import { privateApis as preferencesPrivateApis } from '@/stores/gutenberg/preferences';
import { privateApis as editorPrivateApis } from '@/components/gutenberg/editor';
import { unlock } from '../../lock-unlock';
import { MetaBoxesSection } from './meta-boxes-section';

const { PreferenceToggleControl } = unlock( preferencesPrivateApis );
const { PreferencesModal } = unlock( editorPrivateApis );

export default function EditPostPreferencesModal() {
	const extraSections = {
		general: <MetaBoxesSection title={ __( 'Advanced' ) } />,
		appearance: (
			<PreferenceToggleControl
				scope="core/edit-post"
				featureName="themeStyles"
				help={ __( 'Make the editor look like your theme.' ) }
				label={ __( 'Use theme styles' ) }
			/>
		),
	};

	return <PreferencesModal extraSections={ extraSections } />;
}
