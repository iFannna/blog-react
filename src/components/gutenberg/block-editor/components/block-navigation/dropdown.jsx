import deprecated from '@/utils/gutenberg/deprecated';
import { Button, Dropdown } from '@/components/gutenberg/ui';
import { __ } from '@/lib/gutenberg/i18n';
import { useSelect } from '@/stores/gutenberg/data';
import { forwardRef } from '@/lib/gutenberg/element';
import { listView } from '@/components/gutenberg/icons';
import ListView from '../list-view';
import { store as blockEditorStore } from '../../store';

function BlockNavigationDropdownToggle( {
	isEnabled,
	onToggle,
	isOpen,
	innerRef,
	...props
} ) {
	return (
		<Button
			__next40pxDefaultSize
			{ ...props }
			ref={ innerRef }
			icon={ listView }
			aria-expanded={ isOpen }
			aria-haspopup="true"
			onClick={ isEnabled ? onToggle : undefined }
			/* translators: button label text should, if possible, be under 16 characters. */
			label={ __( 'List view' ) }
			className="block-editor-block-navigation"
			aria-disabled={ ! isEnabled }
		/>
	);
}

function BlockNavigationDropdown( { isDisabled, ...props }, ref ) {
	deprecated( 'wp.blockEditor.BlockNavigationDropdown', {
		since: '6.1',
		alternative: 'wp.components.Dropdown and wp.blockEditor.ListView',
	} );

	const hasBlocks = useSelect(
		( select ) => !! select( blockEditorStore ).getBlockCount(),
		[]
	);
	const isEnabled = hasBlocks && ! isDisabled;

	return (
		<Dropdown
			contentClassName="block-editor-block-navigation__popover"
			popoverProps={ { placement: 'bottom-start' } }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<BlockNavigationDropdownToggle
					{ ...props }
					innerRef={ ref }
					isOpen={ isOpen }
					onToggle={ onToggle }
					isEnabled={ isEnabled }
				/>
			) }
			renderContent={ () => (
				<div className="block-editor-block-navigation__container">
					<p className="block-editor-block-navigation__label">
						{ __( 'List view' ) }
					</p>

					<ListView />
				</div>
			) }
		/>
	);
}

export default forwardRef( BlockNavigationDropdown );
