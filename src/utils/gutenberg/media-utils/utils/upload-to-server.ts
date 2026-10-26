import apiFetch from '@/services/gutenberg/api-fetch';
import { getMediaDataSource } from '@/services/gutenberg/media/source';
import { flattenFormData } from './flatten-form-data';
import { transformAttachment } from './transform-attachment';
import type { CreateRestAttachment, RestAttachment } from './types';

export async function uploadToServer(
	file: File,
	additionalData: CreateRestAttachment = {},
	signal?: AbortSignal
) {
	const mediaSource = getMediaDataSource();
	if ( mediaSource ) {
		const record = await mediaSource.uploadFile( file );
		return transformAttachment( record as RestAttachment );
	}

	// Create upload payload.
	const data = new FormData();
	data.append( 'file', file, file.name || file.type.replace( '/', '.' ) );
	for ( const [ key, value ] of Object.entries( additionalData ) ) {
		flattenFormData( data, key, value );
	}

	return transformAttachment(
		await apiFetch< RestAttachment >( {
			// This allows the video block to directly get a video's poster image.
			path: '/wp/v2/media?_embed=wp:featuredmedia',
			body: data,
			method: 'POST',
			signal,
		} )
	);
}
