import {
	__experimentalTruncate as Truncate,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	FlexItem,
} from '@/components/gutenberg/ui';
import { Icon, chevronDown } from '@/components/gutenberg/icons';
import { __unstableStripHTML as stripHTML } from '@/utils/gutenberg/dom';
import { Badge } from '@/components/gutenberg/design-system';
import type { LinkPreviewProps } from './types';

/**
 * Link preview component that displays the current link information.
 * This is a presentational component meant to be wrapped in a button.
 *
 * @param props        - Component props
 * @param props.title  - Display title for the link
 * @param props.url    - Display URL for the link
 * @param props.image  - Optional image URL for the link preview
 * @param props.badges - Optional array of badge objects with label and intent
 */
export function LinkPreview( { title, url, image, badges }: LinkPreviewProps ) {
	return (
		<HStack justify="space-between" alignment="top">
			<FlexItem className="link-preview-button__content">
				<HStack alignment="top">
					{ image && (
						<FlexItem className="link-preview-button__image-container">
							<img
								className="link-preview-button__image"
								src={ image }
								alt=""
							/>
						</FlexItem>
					) }

					<VStack
						className="link-preview-button__details"
						alignment="topLeft"
					>
						<Truncate
							numberOfLines={ 1 }
							className="link-preview-button__title"
						>
							{ stripHTML( title ) }
						</Truncate>
						{ url && (
							<Truncate
								numberOfLines={ 1 }
								className="link-preview-button__hint"
							>
								{ url }
							</Truncate>
						) }
						{ badges && badges.length > 0 && (
							<HStack
								className="link-preview-button__badges"
								alignment="left"
							>
								{ badges.map( ( badge ) => (
									<Badge
										key={ `${ badge.label }|${ badge.intent }` }
										intent={ badge.intent }
									>
										{ badge.label }
									</Badge>
								) ) }
							</HStack>
						) }
					</VStack>
				</HStack>
			</FlexItem>
			<Icon icon={ chevronDown } className="link-preview-button__icon" />
		</HStack>
	);
}
