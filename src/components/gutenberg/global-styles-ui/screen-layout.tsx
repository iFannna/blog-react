import { __ } from '@/lib/gutenberg/i18n';
// @ts-expect-error: Not typed yet.
import { privateApis as blockEditorPrivateApis } from '@/components/gutenberg/block-editor';
import type { GlobalStylesSettings } from '@/lib/gutenberg/global-styles-engine';
import { ScreenHeader } from './screen-header';
import DimensionsPanel from './dimensions-panel';
import { useSetting } from './hooks';
import { unlock } from './lock-unlock';

const { useHasDimensionsPanel, useSettingsForBlockElement } = unlock(
	blockEditorPrivateApis
);

function ScreenLayout() {
	const [ rawSettings ] = useSetting< GlobalStylesSettings >( '' );
	const settings = useSettingsForBlockElement( rawSettings );
	const hasDimensionsPanel = useHasDimensionsPanel( settings );

	return (
		<>
			<ScreenHeader title={ __( 'Layout' ) } />
			{ hasDimensionsPanel && <DimensionsPanel /> }
		</>
	);
}

export default ScreenLayout;
