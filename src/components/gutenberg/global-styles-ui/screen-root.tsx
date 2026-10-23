import {
	__experimentalItemGroup as ItemGroup,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	FlexItem,
	CardBody,
	Card,
	CardMedia,
} from '@/components/gutenberg/ui';
import { isRTL, __ } from '@/lib/gutenberg/i18n';
import { chevronLeft, chevronRight } from '@/components/gutenberg/icons';
import { useSelect } from '@/stores/gutenberg/data';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { IconWithCurrentColor } from './icon-with-current-color';
import { NavigationButtonAsItem } from './navigation-button';
import RootMenu from './root-menu';
import PreviewStyles from './preview-styles';

function ScreenRoot() {
	const hasVariations = useSelect( ( select ) => {
		const { __experimentalGetCurrentThemeGlobalStylesVariations } =
			select( coreStore );
		return !! __experimentalGetCurrentThemeGlobalStylesVariations()?.length;
	}, [] );

	return (
		<Card
			size="small"
			isBorderless
			className="global-styles-ui-screen-root"
			isRounded={ false }
		>
			<CardBody>
				<VStack spacing={ 4 }>
					<Card className="global-styles-ui-screen-root__active-style-tile">
						<CardMedia className="global-styles-ui-screen-root__active-style-tile-preview">
							<PreviewStyles />
						</CardMedia>
					</Card>
					{ hasVariations && (
						<ItemGroup>
							<NavigationButtonAsItem path="/variations">
								<HStack justify="space-between">
									<FlexItem>
										{ __( 'Browse styles' ) }
									</FlexItem>
									<IconWithCurrentColor
										icon={
											isRTL() ? chevronLeft : chevronRight
										}
									/>
								</HStack>
							</NavigationButtonAsItem>
						</ItemGroup>
					) }
					<RootMenu />
				</VStack>
			</CardBody>
		</Card>
	);
}

export default ScreenRoot;
