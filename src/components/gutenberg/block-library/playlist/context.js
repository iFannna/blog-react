import { createContext } from '@/lib/gutenberg/element';

export const PlaylistContext = createContext( {
	currentTrackClientId: null,
	setCurrentTrackClientId: () => {},
} );
