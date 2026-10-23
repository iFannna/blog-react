import { useSelect } from '@/stores/gutenberg/data';
import { store as keyboardShortcutsStore } from '@/components/gutenberg/keyboard-shortcuts';
import Shortcut from './shortcut';

function DynamicShortcut( { name } ) {
	const { keyCombination, description, aliases } = useSelect(
		( select ) => {
			const {
				getShortcutKeyCombination,
				getShortcutDescription,
				getShortcutAliases,
			} = select( keyboardShortcutsStore );

			return {
				keyCombination: getShortcutKeyCombination( name ),
				aliases: getShortcutAliases( name ),
				description: getShortcutDescription( name ),
			};
		},
		[ name ]
	);

	if ( ! keyCombination ) {
		return null;
	}

	return (
		<Shortcut
			keyCombination={ keyCombination }
			description={ description }
			aliases={ aliases }
		/>
	);
}

export default DynamicShortcut;
