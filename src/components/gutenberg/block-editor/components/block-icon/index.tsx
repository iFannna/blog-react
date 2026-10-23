import clsx from 'clsx';
import { Icon as WCIcon } from '@/components/gutenberg/ui';
import type { IconType } from '@/components/gutenberg/ui';
import { blockDefault } from '@/components/gutenberg/icons';
import { memo } from '@/lib/gutenberg/element';
import type { CSSProperties } from 'react';
import type { BlockTypeIconDescriptor } from '@/lib/gutenberg/blocks';
import type { BlockIconProps } from './types';

function BlockIcon( {
	icon,
	showColors = false,
	className,
	context,
}: BlockIconProps ) {
	if ( ( icon as BlockTypeIconDescriptor )?.src === 'block-default' ) {
		icon = {
			src: blockDefault,
		};
	}

	const renderedIcon = (
		<WCIcon
			icon={
				( icon && ( icon as BlockTypeIconDescriptor ).src
					? ( icon as BlockTypeIconDescriptor ).src
					: icon ) as IconType
			}
			// @ts-expect-error `Icon` passes extra props through to the icon.
			context={ context }
		/>
	);
	const style = showColors
		? {
				backgroundColor:
					icon && ( icon as BlockTypeIconDescriptor ).background,
				color: icon && ( icon as BlockTypeIconDescriptor ).foreground,
			}
		: {};

	return (
		<span
			style={ style as CSSProperties }
			className={ clsx( 'block-editor-block-icon', className, {
				'has-colors': showColors,
			} ) }
		>
			{ renderedIcon }
		</span>
	);
}

/**
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/block-icon/README.md
 */
export default memo( BlockIcon );
