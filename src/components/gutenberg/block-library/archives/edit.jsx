import {
	ToggleControl,
	SelectControl as WCSelectControl,
	Spinner as WCSpinner,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@/components/gutenberg/ui';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import { InspectorControls, useBlockProps } from '@/components/gutenberg/block-editor';
import { useServerSideRender } from '@/components/gutenberg/server-side-render';
import { useDisabled } from '@/hooks/gutenberg/compose';
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';
import HtmlRenderer from '../utils/html-renderer';
import {
	archiveItemLink,
	getProjectLocale,
	isProjectContentSource,
	useProjectArchives,
} from '@/services/gutenberg/project/content';

const GROUP_OPTIONS = [
	{ label: __( 'Year' ), value: 'yearly' },
	{ label: __( 'Month' ), value: 'monthly' },
	{ label: __( 'Day' ), value: 'daily' },
];

function normalizeGroupType( type ) {
	return type === 'yearly' || type === 'daily' ? type : 'monthly';
}

function formatGroupLabel( item ) {
	const locale = getProjectLocale();
	if ( ! item.month ) {
		return new Intl.DateTimeFormat( locale, { year: 'numeric' } ).format(
			new Date( item.year, 0, 1 )
		);
	}
	if ( ! item.day ) {
		return new Intl.DateTimeFormat( locale, {
			year: 'numeric',
			month: 'long',
		} ).format( new Date( item.year, item.month - 1, 1 ) );
	}
	return new Intl.DateTimeFormat( locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	} ).format( new Date( item.year, item.month - 1, item.day ) );
}

function ProjectArchivesPreview( { attributes } ) {
	const { displayAsDropdown, showLabel, showPostCounts } = attributes;
	const groupType = normalizeGroupType( attributes.type );
	const { items, loading, error } = useProjectArchives( groupType );
	const blockProps = useBlockProps( {
		className: displayAsDropdown
			? 'wp-block-archives-dropdown'
			: 'wp-block-archives-list',
	} );

	if ( loading ) {
		return (
			<div { ...blockProps }>
				<WCSpinner />
			</div>
		);
	}

	if ( error ) {
		return (
			<div { ...blockProps }>
				<p>{ sprintf( __( 'Error: %s' ), error ) }</p>
			</div>
		);
	}

	if ( ! items?.length ) {
		return (
			<div { ...blockProps }>
				<p>{ __( 'No archives found.' ) }</p>
			</div>
		);
	}

	const formatCount = ( item ) =>
		showPostCounts ? ` (${ item.count })` : '';

	if ( displayAsDropdown ) {
		return (
			<div { ...blockProps }>
				{ showLabel && (
					<label className="wp-block-archives-dropdown__label">
						{ __( 'Archives' ) }
					</label>
				) }
				<select value="" onChange={ () => {} }>
					<option value="">{ __( 'Select Month' ) }</option>
					{ items.map( ( item ) => (
						<option
							key={ `${ item.year }-${ item.month || 0 }-${
								item.day || 0
							}` }
							value={ archiveItemLink( item ) }
						>
							{ formatGroupLabel( item ) }
							{ formatCount( item ) }
						</option>
					) ) }
				</select>
			</div>
		);
	}

	return (
		<ul { ...blockProps }>
			{ items.map( ( item ) => (
				<li
					key={ `${ item.year }-${ item.month || 0 }-${ item.day || 0 }` }
				>
					<a
						href={ archiveItemLink( item ) }
						onClick={ ( event ) => event.preventDefault() }
					>
						{ formatGroupLabel( item ) }
						{ formatCount( item ) }
					</a>
				</li>
			) ) }
		</ul>
	);
}

function CoreArchivesPreview( { attributes, name } ) {
	const { content, status, error } = useServerSideRender( {
		attributes,
		skipBlockSupportAttributes: true,
		block: name,
	} );

	const disabledRef = useDisabled();
	const blockProps = useBlockProps( { ref: disabledRef } );

	return (
		<>
			{ status === 'loading' && (
				<div { ...blockProps }>
					<WCSpinner />
				</div>
			) }
			{ status === 'error' && (
				<div { ...blockProps }>
					<p>
						{ sprintf(
							/* translators: %s: error message returned when rendering the block. */
							__( 'Error: %s' ),
							error
						) }
					</p>
				</div>
			) }
			{ status === 'success' && (
				<HtmlRenderer wrapperProps={ blockProps } html={ content } />
			) }
		</>
	);
}

export default function ArchivesEdit( { attributes, setAttributes, name } ) {
	const { showLabel, showPostCounts, displayAsDropdown } = attributes;
	const groupType = normalizeGroupType( attributes.type );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						setAttributes( {
							displayAsDropdown: false,
							showLabel: true,
							showPostCounts: false,
							type: 'monthly',
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Display as dropdown' ) }
						isShownByDefault
						hasValue={ () => displayAsDropdown }
						onDeselect={ () =>
							setAttributes( { displayAsDropdown: false } )
						}
					>
						<ToggleControl
							label={ __( 'Display as dropdown' ) }
							checked={ displayAsDropdown }
							onChange={ () =>
								setAttributes( {
									displayAsDropdown: ! displayAsDropdown,
								} )
							}
						/>
					</ToolsPanelItem>

					{ displayAsDropdown && (
						<ToolsPanelItem
							label={ __( 'Show label' ) }
							isShownByDefault
							hasValue={ () => ! showLabel }
							onDeselect={ () =>
								setAttributes( { showLabel: true } )
							}
						>
							<ToggleControl
								label={ __( 'Show label' ) }
								checked={ showLabel }
								onChange={ () =>
									setAttributes( {
										showLabel: ! showLabel,
									} )
								}
							/>
						</ToolsPanelItem>
					) }

					<ToolsPanelItem
						label={ __( 'Show post counts' ) }
						isShownByDefault
						hasValue={ () => showPostCounts }
						onDeselect={ () =>
							setAttributes( { showPostCounts: false } )
						}
					>
						<ToggleControl
							label={ __( 'Show post counts' ) }
							checked={ showPostCounts }
							onChange={ () =>
								setAttributes( {
									showPostCounts: ! showPostCounts,
								} )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						label={ __( 'Group by' ) }
						isShownByDefault
						hasValue={ () => groupType !== 'monthly' }
						onDeselect={ () =>
							setAttributes( { type: 'monthly' } )
						}
					>
						<WCSelectControl
							label={ __( 'Group by' ) }
							options={ GROUP_OPTIONS }
							value={ groupType }
							onChange={ ( value ) =>
								setAttributes( { type: value } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			{ isProjectContentSource() ? (
				<ProjectArchivesPreview attributes={ attributes } />
			) : (
				<CoreArchivesPreview attributes={ attributes } name={ name } />
			) }
		</>
	);
}
