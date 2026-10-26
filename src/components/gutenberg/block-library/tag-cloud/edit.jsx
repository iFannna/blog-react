import {
	Flex,
	FlexItem,
	ToggleControl,
	SelectControl as WCSelectControl,
	Spinner as WCSpinner,
	RangeControl,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@/components/gutenberg/ui';
import { useSelect } from '@/stores/gutenberg/data';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import {
	InspectorControls,
	useBlockProps,
	useSettings,
} from '@/components/gutenberg/block-editor';
import { store as coreStore } from '@/stores/gutenberg/core-data';
import { useServerSideRender } from '@/components/gutenberg/server-side-render';
import { useDisabled } from '@/hooks/gutenberg/compose';
import {
	getProjectLocale,
	isProjectContentSource,
} from '@/services/gutenberg/project/content';
import { decodeEntities } from '@/utils/gutenberg/html-entities';
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';
import HtmlRenderer from '../utils/html-renderer';
import { useTermRecords } from '../utils/use-term-records';

/**
 * Minimum number of tags a user can show using this block.
 *
 * @type {number}
 */
const MIN_TAGS = 1;

/**
 * Maximum number of tags a user can show using this block.
 *
 * @type {number}
 */
const MAX_TAGS = 100;

const MIN_FONT_SIZE = 0.1;
const MAX_FONT_SIZE = 100;

function parseFontSize( value ) {
	const match = /^\s*([\d.]+)\s*([a-z%]+)\s*$/i.exec( value ?? '' );
	if ( ! match ) {
		return { quantity: 8, unit: 'pt' };
	}
	return {
		quantity: parseFloat( match[ 1 ] ),
		unit: match[ 2 ],
	};
}

function ProjectTagCloudPreview( { attributes } ) {
	const {
		taxonomy,
		showTagCounts,
		numberOfTags,
		smallestFontSize,
		largestFontSize,
	} = attributes;
	const blockProps = useBlockProps();

	// 项目编辑器直接读取 Go 的标签/分类计数，示例编辑器继续走服务端预览。
	// 顺序与 wp_tag_cloud 默认值一致：按名称升序，字号按文章数缩放。
	const { records, isResolving } = useTermRecords( taxonomy, {
		per_page: numberOfTags,
		orderby: 'name',
		order: 'asc',
		hide_empty: true,
	} );

	if ( isResolving ) {
		return (
			<p { ...blockProps }>
				<WCSpinner />
			</p>
		);
	}

	const terms = records ?? [];
	if ( terms.length === 0 ) {
		return <p { ...blockProps } />;
	}

	const smallest = parseFontSize( smallestFontSize );
	const largest = parseFontSize( largestFontSize );
	const counts = terms.map( ( term ) => Number( term.count ) || 0 );
	const minCount = Math.min( ...counts );
	const maxCount = Math.max( ...counts );
	const countSpread = maxCount - minCount;
	const fontStep =
		countSpread > 0
			? ( largest.quantity - smallest.quantity ) / countSpread
			: 0;
	const basePath = `/${ getProjectLocale() }/${
		taxonomy === 'category' ? 'category' : 'tag'
	}`;

	return (
		<p { ...blockProps }>
			{ terms.map( ( term, index ) => {
				const name = decodeEntities( term.name ).trim();
				const count = Number( term.count ) || 0;
				const fontSize =
					smallest.quantity + ( count - minCount ) * fontStep;
				return (
					<a
						key={ term.id }
						className={ `tag-cloud-link tag-link-${ term.id } tag-link-position-${
							index + 1
						}` }
						href={ `${ basePath }/${ encodeURIComponent( name ) }` }
						style={ {
							fontSize: `${ Number(
								fontSize.toFixed( 2 )
							) }${ smallest.unit }`,
						} }
						onClick={ ( event ) => event.preventDefault() }
					>
						{ name }
						{ showTagCounts && (
							<span className="tag-link-count">
								{ ` (${ count })` }
							</span>
						) }
					</a>
				);
			} ) }
		</p>
	);
}

function ServerTagCloudPreview( { attributes, name } ) {
	const { content, status, error } = useServerSideRender( {
		attributes,
		skipBlockSupportAttributes: true,
		block: name,
	} );

	const disabledRef = useDisabled();
	const blockProps = useBlockProps( { ref: disabledRef } );

	if ( status === 'loading' ) {
		return (
			<div { ...blockProps }>
				<WCSpinner />
			</div>
		);
	}

	if ( status === 'error' ) {
		return (
			<div { ...blockProps }>
				<p>
					{ sprintf(
						/* translators: %s: error message returned when rendering the block. */
						__( 'Error: %s' ),
						error
					) }
				</p>
			</div>
		);
	}

	if ( status === 'success' ) {
		return <HtmlRenderer wrapperProps={ blockProps } html={ content } />;
	}

	return null;
}

function TagCloudEdit( { attributes, setAttributes, name } ) {
	const {
		taxonomy,
		showTagCounts,
		numberOfTags,
		smallestFontSize,
		largestFontSize,
	} = attributes;

	const projectActive = isProjectContentSource();
	const [ availableUnits ] = useSettings( 'spacing.units' );
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	// The `pt` unit is used as the default value and is therefore
	// always considered an available unit.
	const units = useCustomUnits( {
		availableUnits: availableUnits
			? [ ...availableUnits, 'pt' ]
			: [ '%', 'px', 'em', 'rem', 'pt' ],
	} );

	const taxonomies = useSelect(
		( select ) =>
			projectActive
				? null
				: select( coreStore ).getTaxonomies( { per_page: -1 } ),
		[ projectActive ]
	);

	const getTaxonomyOptions = () => {
		const selectOption = {
			label: __( '- Select -' ),
			value: '',
			disabled: true,
		};
		const taxonomyOptions = projectActive
			? [
					{ value: 'post_tag', label: __( 'Tags' ) },
					{ value: 'category', label: __( 'Categories' ) },
			  ]
			: ( taxonomies ?? [] )
					.filter( ( tax ) => !! tax.show_cloud )
					.map( ( item ) => {
						return {
							value: item.slug,
							label: item.name,
						};
					} );

		return [ selectOption, ...taxonomyOptions ];
	};

	const onFontSizeChange = ( fontSizeLabel, newValue ) => {
		const [ quantity, newUnit ] =
			parseQuantityAndUnitFromRawValue( newValue );
		if ( ! Number.isFinite( quantity ) ) {
			return;
		}
		const updateObj = { [ fontSizeLabel ]: newValue };
		// We need to keep in sync the `unit` changes to both `smallestFontSize`
		// and `largestFontSize` attributes.
		Object.entries( {
			smallestFontSize,
			largestFontSize,
		} ).forEach( ( [ attribute, currentValue ] ) => {
			const [ currentQuantity, currentUnit ] =
				parseQuantityAndUnitFromRawValue( currentValue );
			// Only add an update if the other font size attribute has a different unit.
			if ( attribute !== fontSizeLabel && currentUnit !== newUnit ) {
				updateObj[ attribute ] = `${ currentQuantity }${ newUnit }`;
			}
		} );
		setAttributes( updateObj );
	};

	const inspectorControls = (
		<InspectorControls>
			<ToolsPanel
				label={ __( 'Settings' ) }
				resetAll={ () => {
					setAttributes( {
						taxonomy: 'post_tag',
						showTagCounts: false,
						numberOfTags: 45,
						smallestFontSize: '8pt',
						largestFontSize: '22pt',
					} );
				} }
				dropdownMenuProps={ dropdownMenuProps }
			>
				<ToolsPanelItem
					hasValue={ () => taxonomy !== 'post_tag' }
					label={ __( 'Taxonomy' ) }
					onDeselect={ () =>
						setAttributes( { taxonomy: 'post_tag' } )
					}
					isShownByDefault
				>
					<WCSelectControl
						label={ __( 'Taxonomy' ) }
						options={ getTaxonomyOptions() }
						value={ taxonomy }
						onChange={ ( selectedTaxonomy ) =>
							setAttributes( { taxonomy: selectedTaxonomy } )
						}
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={ () =>
						smallestFontSize !== '8pt' || largestFontSize !== '22pt'
					}
					label={ __( 'Font size' ) }
					onDeselect={ () =>
						setAttributes( {
							smallestFontSize: '8pt',
							largestFontSize: '22pt',
						} )
					}
					isShownByDefault
				>
					<Flex gap={ 4 }>
						<FlexItem isBlock>
							<UnitControl
								label={ __( 'Smallest size' ) }
								value={ smallestFontSize }
								onChange={ ( value ) => {
									onFontSizeChange(
										'smallestFontSize',
										value
									);
								} }
								units={ units }
								min={ MIN_FONT_SIZE }
								max={ MAX_FONT_SIZE }
							/>
						</FlexItem>
						<FlexItem isBlock>
							<UnitControl
								label={ __( 'Largest size' ) }
								value={ largestFontSize }
								onChange={ ( value ) => {
									onFontSizeChange(
										'largestFontSize',
										value
									);
								} }
								units={ units }
								min={ MIN_FONT_SIZE }
								max={ MAX_FONT_SIZE }
							/>
						</FlexItem>
					</Flex>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={ () => numberOfTags !== 45 }
					label={ __( 'Number of tags' ) }
					onDeselect={ () => setAttributes( { numberOfTags: 45 } ) }
					isShownByDefault
				>
					<RangeControl
						label={ __( 'Number of tags' ) }
						value={ numberOfTags }
						onChange={ ( value ) =>
							setAttributes( { numberOfTags: value } )
						}
						min={ MIN_TAGS }
						max={ MAX_TAGS }
						required
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={ () => showTagCounts !== false }
					label={ __( 'Show tag counts' ) }
					onDeselect={ () =>
						setAttributes( { showTagCounts: false } )
					}
					isShownByDefault
				>
					<ToggleControl
						label={ __( 'Show tag counts' ) }
						checked={ showTagCounts }
						onChange={ () =>
							setAttributes( { showTagCounts: ! showTagCounts } )
						}
					/>
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);

	return (
		<>
			{ inspectorControls }
			{ projectActive ? (
				<ProjectTagCloudPreview attributes={ attributes } />
			) : (
				<ServerTagCloudPreview attributes={ attributes } name={ name } />
			) }
		</>
	);
}

export default TagCloudEdit;
