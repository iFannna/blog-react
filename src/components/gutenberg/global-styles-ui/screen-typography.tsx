import { __ } from '@/lib/gutenberg/i18n';
import { Stack } from '@/components/gutenberg/design-system';
import { useContext } from '@/lib/gutenberg/element';
import { ScreenHeader } from './screen-header';
import { ScreenBody } from './screen-body';
import TypographyElements from './typography-elements';
import TypographyVariations from './variations/variations-typography';
import FontFamilies from './font-families';
import FontSizesCount from './font-sizes/font-sizes-count';
import TextShadows from './text-shadows';
import { GlobalStylesContext } from './context';
import { useSetting } from './hooks';

function ScreenTypography() {
	const { fontLibraryEnabled } = useContext( GlobalStylesContext );

	const [ hasTextShadowControl ] = useSetting< boolean | undefined >(
		'typography.textShadow'
	);

	return (
		<>
			<ScreenHeader
				title={ __( 'Typography' ) }
				description={ __(
					'Manage the fonts and typographic styles available across the site.'
				) }
			/>
			<ScreenBody>
				<Stack direction="column" gap="xl">
					<TypographyVariations title={ __( 'Typesets' ) } />
					{ fontLibraryEnabled && <FontFamilies /> }
					<TypographyElements />
					<FontSizesCount />
					{ hasTextShadowControl && <TextShadows /> }
				</Stack>
			</ScreenBody>
		</>
	);
}

export default ScreenTypography;
