import { createSlotFill } from '@/components/gutenberg/ui';
import EnablePanelOption from './enable-panel';

const { Fill, Slot } = createSlotFill(
	'EnablePluginDocumentSettingPanelOption'
);

const EnablePluginDocumentSettingPanelOption = ( { label, panelName } ) => (
	<Fill>
		<EnablePanelOption label={ label } panelName={ panelName } />
	</Fill>
);

EnablePluginDocumentSettingPanelOption.Slot = Slot;

export default EnablePluginDocumentSettingPanelOption;
