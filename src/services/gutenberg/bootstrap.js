import { initializeCommandPalette } from '@/components/gutenberg/core-commands';
import { initializeEditor } from '@/components/gutenberg/edit-post';
import settings from '@/lib/gutenberg/fixtures/settings.js';
import { installMockApi } from '@/services/gutenberg/mock/api.js';
import { configureCanvasAssets } from '@/styles/gutenberg/canvas.js';
import '@/styles/gutenberg/inline.js';
import '@/styles/gutenberg/compiled/index.js';
import '@/styles/gutenberg/index.css';

installMockApi( settings.locale );
configureCanvasAssets( settings );

initializeEditor( 'editor', 'page', 97589, settings, {} );
initializeCommandPalette( { menu_commands: [], is_network_admin: false } );
