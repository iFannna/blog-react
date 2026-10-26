import apiFetch from '@/services/gutenberg/api-fetch';
import { getMediaDataSource } from '@/services/gutenberg/media/source';

export default async function mediaDelete( id ) {
	const mediaSource = getMediaDataSource();
	if ( mediaSource ) {
		await mediaSource.deleteRecord( id );
		return;
	}

	await apiFetch( {
		path: `/wp/v2/media/${ id }?force=true`,
		method: 'DELETE',
	} );
}
