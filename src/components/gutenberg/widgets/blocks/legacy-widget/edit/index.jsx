import clsx from 'clsx';
import {
	useBlockProps,
	BlockControls,
	InspectorControls,
	BlockIcon,
} from '@/components/gutenberg/block-editor';
import {
	Flex,
	FlexBlock,
	Spinner as WCSpinner,
	Placeholder,
} from '@/components/gutenberg/ui';
import { brush as brushIcon } from '@/components/gutenberg/icons';
import { __ } from '@/lib/gutenberg/i18n';
import { useState, useCallback } from '@/lib/gutenberg/element';
import { useEntityRecord } from '@/stores/gutenberg/core-data';
import WidgetTypeSelector from './widget-type-selector';
import InspectorCard from './inspector-card';
import Form from './form';
import Preview from './preview';
import NoPreview from './no-preview';
import ConvertToBlocksButton from './convert-to-blocks-button';

export default function Edit( props ) {
	const { id, idBase } = props.attributes;
	const { isWide = false } = props;

	const blockProps = useBlockProps( {
		className: clsx( {
			'is-wide-widget': isWide,
		} ),
	} );

	return (
		<div { ...blockProps }>
			{ ! id && ! idBase ? (
				<Empty { ...props } />
			) : (
				<NotEmpty { ...props } />
			) }
		</div>
	);
}

function Empty( { attributes: { id, idBase }, setAttributes } ) {
	return (
		<Placeholder
			icon={ <BlockIcon icon={ brushIcon } /> }
			label={ __( 'Legacy Widget' ) }
		>
			<Flex>
				<FlexBlock>
					<WidgetTypeSelector
						selectedId={ id ?? idBase }
						onSelect={ ( { selectedId, isMulti } ) => {
							if ( ! selectedId ) {
								setAttributes( {
									id: null,
									idBase: null,
									instance: null,
								} );
							} else if ( isMulti ) {
								setAttributes( {
									id: null,
									idBase: selectedId,
									instance: {},
								} );
							} else {
								setAttributes( {
									id: selectedId,
									idBase: null,
									instance: null,
								} );
							}
						} }
					/>
				</FlexBlock>
			</Flex>
		</Placeholder>
	);
}

function NotEmpty( {
	attributes: { id, idBase, instance },
	setAttributes,
	clientId,
	isSelected,
	isWide = false,
} ) {
	const [ hasPreview, setHasPreview ] = useState( null );

	const widgetTypeId = id ?? idBase;
	const { record: widgetType, hasResolved: hasResolvedWidgetType } =
		useEntityRecord( 'root', 'widgetType', widgetTypeId );

	const setInstance = useCallback( ( nextInstance ) => {
		setAttributes( { instance: nextInstance } );
	}, [] );

	if ( ! widgetType && hasResolvedWidgetType ) {
		return (
			<Placeholder
				icon={ <BlockIcon icon={ brushIcon } /> }
				label={ __( 'Legacy Widget' ) }
			>
				{ __( 'Widget is missing.' ) }
			</Placeholder>
		);
	}

	if ( ! hasResolvedWidgetType ) {
		return (
			<Placeholder>
				<WCSpinner />
			</Placeholder>
		);
	}

	const mode = idBase && ! isSelected ? 'preview' : 'edit';

	return (
		<>
			{ idBase === 'text' && (
				<BlockControls group="other">
					<ConvertToBlocksButton
						clientId={ clientId }
						rawInstance={ instance.raw }
					/>
				</BlockControls>
			) }

			<InspectorControls>
				<InspectorCard
					name={ widgetType.name }
					description={ widgetType.description }
				/>
			</InspectorControls>

			<Form
				title={ widgetType.name }
				isVisible={ mode === 'edit' }
				id={ id }
				idBase={ idBase }
				instance={ instance }
				isWide={ isWide }
				onChangeInstance={ setInstance }
				onChangeHasPreview={ setHasPreview }
			/>

			{ idBase && (
				<>
					{ hasPreview === null && mode === 'preview' && (
						<Placeholder>
							<WCSpinner />
						</Placeholder>
					) }
					{ hasPreview === true && (
						<Preview
							idBase={ idBase }
							instance={ instance }
							isVisible={ mode === 'preview' }
						/>
					) }
					{ hasPreview === false && mode === 'preview' && (
						<NoPreview name={ widgetType.name } />
					) }
				</>
			) }
		</>
	);
}
