// eslint-disable-next-line @wordpress/use-recommended-components -- Intentional early adoption of the new Menu, pending WordPress/gutenberg#76135.
import { Menu } from '@/components/gutenberg/design-system';
import { __ } from '@/lib/gutenberg/i18n';
import { useSelect } from '@/stores/gutenberg/data';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { useAllowSwitchingTemplates } from './hooks';

export default function CreateNewTemplate( { onClick } ) {
	const { canCreateTemplates } = useSelect( ( select ) => {
		const { canUser } = select( coreStore );
		return {
			canCreateTemplates: canUser( 'create', {
				kind: 'postType',
				name: 'wp_template',
			} ),
		};
	}, [] );
	const allowSwitchingTemplate = useAllowSwitchingTemplates();

	// The default template in a post is indicated by an empty string.
	if ( ! canCreateTemplates || ! allowSwitchingTemplate ) {
		return null;
	}
	return (
		<Menu.Item onClick={ onClick }>
			<Menu.ItemLabel>{ __( 'Create new template' ) }</Menu.ItemLabel>
		</Menu.Item>
	);
}
