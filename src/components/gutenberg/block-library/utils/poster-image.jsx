import clsx from 'clsx';
import {
	MediaUpload,
	MediaUploadCheck,
	store as blockEditorStore,
} from '@/components/gutenberg/block-editor';
import { store as noticesStore } from '@/stores/gutenberg/notices';
import {
	Button,
	BaseControl,
	DropZone,
	Spinner as WCSpinner,
	__experimentalHStack as HStack,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@/components/gutenberg/ui';
import { isBlobURL } from '@/utils/gutenberg/blob';
import { __, sprintf } from '@/lib/gutenberg/i18n';
import { useRef, useState } from '@/lib/gutenberg/element';
import { useInstanceId } from '@/hooks/gutenberg/compose';
import { useSelect, useDispatch } from '@/stores/gutenberg/data';

const POSTER_IMAGE_ALLOWED_MEDIA_TYPES = [ 'image' ];

function PosterImage( { poster, onChange } ) {
	const posterButtonRef = useRef();
	const [ isLoading, setIsLoading ] = useState( false );
	const descriptionId = useInstanceId(
		PosterImage,
		'block-library-poster-image-description'
	);

	const { getSettings } = useSelect( blockEditorStore );
	const { createErrorNotice } = useDispatch( noticesStore );

	const onDropFiles = ( filesList ) => {
		getSettings().mediaUpload( {
			allowedTypes: POSTER_IMAGE_ALLOWED_MEDIA_TYPES,
			filesList,
			onFileChange: ( [ image ] ) => {
				if ( isBlobURL( image?.url ) ) {
					setIsLoading( true );
					return;
				}

				if ( image ) {
					onChange( image );
				}
				setIsLoading( false );
			},
			onError: ( message ) => {
				createErrorNotice( message, {
					id: 'poster-image-upload-notice',
					type: 'snackbar',
				} );
				setIsLoading( false );
			},
			multiple: false,
		} );
	};

	const getPosterButtonContent = () => {
		if ( ! poster && isLoading ) {
			return <WCSpinner />;
		}

		return ! poster ? __( 'Set poster image' ) : __( 'Replace' );
	};

	return (
		<MediaUploadCheck>
			<ToolsPanelItem
				label={ __( 'Poster image' ) }
				isShownByDefault
				hasValue={ () => !! poster }
				onDeselect={ () => onChange( undefined ) }
			>
				<BaseControl.VisualLabel>
					{ __( 'Poster image' ) }
				</BaseControl.VisualLabel>
				<MediaUpload
					title={ __( 'Select poster image' ) }
					onSelect={ onChange }
					allowedTypes={ POSTER_IMAGE_ALLOWED_MEDIA_TYPES }
					render={ ( { open } ) => (
						<div className="block-library-poster-image__container">
							{ poster && (
								<Button
									__next40pxDefaultSize
									onClick={ open }
									aria-haspopup="dialog"
									aria-label={ __(
										'Edit or replace the poster image.'
									) }
									className="block-library-poster-image__preview"
									disabled={ isLoading }
									accessibleWhenDisabled
								>
									<img
										src={ poster }
										alt={ __( 'Poster image preview' ) }
										className="block-library-poster-image__preview-image"
									/>
									{ isLoading && <WCSpinner /> }
								</Button>
							) }
							<HStack
								className={ clsx(
									'block-library-poster-image__actions',
									{
										'block-library-poster-image__actions-select':
											! poster,
									}
								) }
							>
								<Button
									__next40pxDefaultSize
									onClick={ open }
									ref={ posterButtonRef }
									className="block-library-poster-image__action"
									aria-describedby={ descriptionId }
									aria-haspopup="dialog"
									variant={
										! poster ? 'secondary' : undefined
									}
									disabled={ isLoading }
									accessibleWhenDisabled
								>
									{ getPosterButtonContent() }
								</Button>
								<p id={ descriptionId } hidden>
									{ poster
										? sprintf(
												/* translators: %s: poster image URL. */
												__(
													'The current poster image url is %s.'
												),
												poster
											)
										: __(
												'There is no poster image currently selected.'
											) }
								</p>
								{ !! poster && (
									<Button
										__next40pxDefaultSize
										onClick={ () => {
											onChange( undefined );

											// Move focus back to the Media Upload button.
											posterButtonRef.current.focus();
										} }
										className="block-library-poster-image__action"
										disabled={ isLoading }
										accessibleWhenDisabled
									>
										{ __( 'Remove' ) }
									</Button>
								) }
							</HStack>
							<DropZone onFilesDrop={ onDropFiles } />
						</div>
					) }
				/>
			</ToolsPanelItem>
		</MediaUploadCheck>
	);
}

export default PosterImage;
