import clsx from 'clsx';
import type { ForwardedRef } from 'react';
import { forwardRef, useMemo } from '@/lib/gutenberg/element';
import deprecated from '@/utils/gutenberg/deprecated';
import ToolbarGroup from '../toolbar-group';
import ToolbarContainer from './toolbar-container';
import type { ToolbarProps } from './types';
import type { WordPressComponentProps } from '../../context';
import { ContextSystemProvider } from '../../context';

function UnforwardedToolbar(
	{
		className,
		label,
		variant,
		...props
	}: WordPressComponentProps< ToolbarProps, 'div', false >,
	ref: ForwardedRef< any >
) {
	const isVariantDefined = variant !== undefined;
	const contextSystemValue = useMemo( () => {
		if ( isVariantDefined ) {
			return {};
		}
		return {
			DropdownMenu: {
				variant: 'toolbar',
			},
			Dropdown: {
				variant: 'toolbar',
			},
			Menu: {
				variant: 'toolbar',
			},
		};
	}, [ isVariantDefined ] );

	if ( ! label ) {
		deprecated( 'Using Toolbar without label prop', {
			since: '5.6',
			alternative: 'ToolbarGroup component',
			link: 'https://developer.wordpress.org/block-editor/components/toolbar/',
		} );
		// Extracting title from `props` because `ToolbarGroup` doesn't accept it.
		const { title: _title, ...restProps } = props;
		return (
			<ToolbarGroup
				isCollapsed={ false }
				{ ...restProps }
				className={ className }
			/>
		);
	}
	// `ToolbarGroup` already uses components-toolbar for compatibility reasons.
	const finalClassName = clsx(
		'components-accessible-toolbar',
		className,
		variant && `is-${ variant }`
	);

	return (
		<ContextSystemProvider value={ contextSystemValue }>
			<ToolbarContainer
				className={ finalClassName }
				label={ label }
				ref={ ref }
				{ ...props }
			/>
		</ContextSystemProvider>
	);
}

/**
 * Renders a toolbar.
 *
 * To add controls, simply pass `ToolbarButton` components as children.
 *
 * ```jsx
 * import { Toolbar, ToolbarButton } from '@/components/gutenberg/ui';
 * import { formatBold, formatItalic, link } from '@/components/gutenberg/icons';
 *
 * function MyToolbar() {
 *   return (
 *     <Toolbar label="Options">
 *       <ToolbarButton icon={ formatBold } label="Bold" />
 *       <ToolbarButton icon={ formatItalic } label="Italic" />
 *       <ToolbarButton icon={ link } label="Link" />
 *     </Toolbar>
 *   );
 * }
 * ```
 */
export const Toolbar = forwardRef( UnforwardedToolbar );
Toolbar.displayName = 'Toolbar';
export default Toolbar;
