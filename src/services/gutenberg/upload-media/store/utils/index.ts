import { ImageFile } from '../../image-file';
import { getFileBasename } from '../../utils';
import type { ImageSizeCrop, QueueItemId } from '../types';

/**
 * Options for converting or compressing an image in a web worker.
 */
interface VipsConvertOptions {
	/**
	 * Desired quality (0-1).
	 */
	quality?: number;
	/**
	 * Whether to use interlaced/progressive mode.
	 */
	interlaced?: boolean;
	/**
	 * Whether to strip metadata (except color profiles).
	 */
	stripMeta?: boolean;
	/**
	 * Maximum output bit depth.
	 */
	maxBitdepth?: number;
}

/**
 * Options for resizing an image in a web worker.
 */
interface VipsResizeOptions {
	/**
	 * Whether to use smart cropping (saliency-aware).
	 */
	smartCrop?: boolean;
	/**
	 * Whether to add dimension suffix to the filename.
	 */
	addSuffix?: boolean;
	/**
	 * Optional abort signal to cancel the operation.
	 */
	signal?: AbortSignal;
	/**
	 * Whether to add a '-scaled' suffix instead of dimensions (for the big
	 * image threshold).
	 */
	scaledSuffix?: boolean;
	/**
	 * Desired quality (0-1).
	 */
	quality?: number;
	/**
	 * Whether to strip metadata (except color profiles).
	 */
	stripMeta?: boolean;
	/**
	 * Maximum output bit depth.
	 */
	maxBitdepth?: number;
	/**
	 * Whether animated images should keep their animation when resized.
	 */
	preserveAnimation?: boolean;
}

/**
 * Client-side image processing is unavailable in this demo.
 *
 * The upstream module bundles ~10MB of WASM (`@wordpress/vips/worker`).
 * Media uploads are mocked here, so every image operation rejects instead
 * of loading the worker.
 */
const unavailable = () =>
	Promise.reject(
		new Error( 'Image processing is not available in this demo.' )
	);

const vipsModule = {
	vipsConvertImageFormat: unavailable,
	vipsCompressImage: unavailable,
	vipsResizeImage: unavailable,
	vipsRotateImage: unavailable,
	vipsGetUltraHdrInfo: unavailable,
	vipsHasTransparency: unavailable,
	vipsCancelOperations: () => Promise.resolve( false ),
	terminateVipsWorker() {},
};

/**
 * Returns the local fallback vips module.
 *
 * @return The fallback vips module.
 */
function loadVipsModule(): Promise< typeof vipsModule > {
	return Promise.resolve( vipsModule );
}

/**
 * Converts an image to a different format using vips in a web worker.
 *
 * @param id      Queue item ID.
 * @param file    File object.
 * @param type    Output mime type.
 * @param options Conversion options.
 * @return Converted file.
 */
export async function vipsConvertImageFormat(
	id: QueueItemId,
	file: File,
	type:
		'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif' | 'image/gif',
	options: VipsConvertOptions = {}
) {
	const { vipsConvertImageFormat: convertImageFormat } =
		await loadVipsModule();
	const buffer = await convertImageFormat(
		id,
		await file.arrayBuffer(),
		file.type,
		type,
		options
	);
	const ext = type.split( '/' )[ 1 ];
	const fileName = `${ getFileBasename( file.name ) }.${ ext }`;
	return new File( [ new Blob( [ buffer as ArrayBuffer ] ) ], fileName, {
		type,
	} );
}

/**
 * Compresses an image using vips in a web worker.
 *
 * @param id      Queue item ID.
 * @param file    File object.
 * @param options Compression options.
 * @return Compressed file.
 */
export async function vipsCompressImage(
	id: QueueItemId,
	file: File,
	options: VipsConvertOptions = {}
) {
	const { vipsCompressImage: compressImage } = await loadVipsModule();
	const buffer = await compressImage(
		id,
		await file.arrayBuffer(),
		file.type,
		options
	);
	return new File(
		[ new Blob( [ buffer as ArrayBuffer ], { type: file.type } ) ],
		file.name,
		{ type: file.type }
	);
}

/**
 * Checks whether an image has transparency using vips in a web worker.
 *
 * @param url Image URL.
 * @return Whether the image has transparency.
 */
export async function vipsHasTransparency( url: string ) {
	const { vipsHasTransparency: hasTransparency } = await loadVipsModule();
	const response = await fetch( url );
	if ( ! response.ok ) {
		throw new Error( `Failed to fetch image: ${ response.status }` );
	}
	return hasTransparency( await response.arrayBuffer() );
}

/**
 * Probes a JPEG buffer for UltraHDR (ISO 21496-1 gain map) support using vips
 * in a web worker.
 *
 * @param buffer Image buffer to probe.
 * @return UltraHDR info if the buffer is a valid UltraHDR JPEG, otherwise null.
 */
export async function vipsGetUltraHdrInfo( buffer: ArrayBuffer ) {
	const { vipsGetUltraHdrInfo: getUltraHdrInfo } = await loadVipsModule();
	return getUltraHdrInfo( buffer );
}

/**
 * Resizes an image using vips in a web worker.
 *
 * UltraHDR JPEGs are auto-detected by libvips and their gain map is
 * preserved through the resize.
 *
 * @param id      Queue item ID.
 * @param file    File object.
 * @param resize  Resize options (width, height, crop).
 * @param options Additional resize options.
 * @return Resized ImageFile with dimension metadata.
 */
export async function vipsResizeImage(
	id: QueueItemId,
	file: File,
	resize: ImageSizeCrop,
	options: VipsResizeOptions = {}
) {
	const {
		smartCrop = false,
		addSuffix = false,
		signal,
		scaledSuffix,
		quality,
		stripMeta,
		maxBitdepth,
		preserveAnimation,
	} = options;

	if ( signal?.aborted ) {
		throw new Error( 'Operation aborted' );
	}

	const { vipsResizeImage: resizeImage } = await loadVipsModule();
	const { buffer, width, height, originalWidth, originalHeight } =
		await resizeImage( id, await file.arrayBuffer(), file.type, resize, {
			smartCrop,
			quality,
			stripMeta,
			maxBitdepth,
			preserveAnimation,
		} );

	let fileName = file.name;
	const wasResized = originalWidth > width || originalHeight > height;

	if ( wasResized ) {
		const basename = getFileBasename( file.name );
		if ( scaledSuffix ) {
			// Add '-scaled' suffix for big image threshold resizing.
			// This matches WordPress core's behavior in wp_create_image_subsizes().
			fileName = file.name.replace( basename, `${ basename }-scaled` );
		} else if ( addSuffix ) {
			// Add dimension suffix for thumbnails.
			fileName = file.name.replace(
				basename,
				`${ basename }-${ width }x${ height }`
			);
		}
	}

	const resultFile = new ImageFile(
		new File(
			[ new Blob( [ buffer as ArrayBuffer ], { type: file.type } ) ],
			fileName,
			{
				type: file.type,
			}
		),
		width,
		height,
		originalWidth,
		originalHeight
	);

	return resultFile;
}

/**
 * Rotates an image based on EXIF orientation using vips in a web worker.
 *
 * This applies the correct rotation/flip transformation based on the EXIF
 * orientation value (1-8), and adds a '-rotated' suffix to the filename.
 * This matches WordPress core's behavior when rotating images based on EXIF.
 *
 * @param id          Queue item ID.
 * @param file        File object.
 * @param orientation EXIF orientation value (1-8).
 * @param signal      Optional abort signal to cancel the operation.
 * @return Rotated ImageFile with updated dimensions.
 */
export async function vipsRotateImage(
	id: QueueItemId,
	file: File,
	orientation: number,
	signal?: AbortSignal
) {
	if ( signal?.aborted ) {
		throw new Error( 'Operation aborted' );
	}

	// If orientation is 1 (normal), no rotation needed.
	if ( orientation === 1 ) {
		return file;
	}

	const { vipsRotateImage: rotateImage } = await loadVipsModule();
	const { buffer, width, height } = await rotateImage(
		id,
		await file.arrayBuffer(),
		file.type,
		orientation
	);

	// Add '-rotated' suffix to filename, matching WordPress core behavior.
	const basename = getFileBasename( file.name );
	const fileName = file.name.replace( basename, `${ basename }-rotated` );

	const resultFile = new ImageFile(
		new File(
			[ new Blob( [ buffer as ArrayBuffer ], { type: file.type } ) ],
			fileName,
			{
				type: file.type,
			}
		),
		width,
		height
	);

	return resultFile;
}

/**
 * Cancels all ongoing image operations for the given item.
 *
 * Client-side processing is unavailable, so nothing can be running.
 *
 * @param _id Queue item ID to cancel operations for.
 * @return Always false.
 */
export async function vipsCancelOperations( _id: QueueItemId ) {
	return false;
}

/**
 * Terminates the image processing worker.
 *
 * No worker is loaded in this build, so this is a no-op.
 */
export function terminateVipsWorker(): void {}

/**
 * Records a completed image processing operation.
 *
 * No worker is loaded in this build, so there is nothing to recycle.
 *
 * @param _activeImageProcessingCount Number of operations currently in flight.
 */
export function maybeRecycleVipsWorker(
	_activeImageProcessingCount: number
): void {}
