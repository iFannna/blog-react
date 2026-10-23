import { initializeCommandPalette } from '@wordpress/core-commands';
import { initializeEditor } from '@wordpress/edit-post';
import settings from './fixtures/settings.js';
import { installMockApi } from '@/services/gutenberg/mock/api.js';
import { configureCanvasAssets } from '@/styles/gutenberg/canvas.js';
import '@/styles/gutenberg/inline.js';
import '@/styles/gutenberg/snapshot/index.js';
import '@/styles/gutenberg/app.css';

installMockApi( settings.locale );
configureCanvasAssets( settings );

initializeEditor( 'editor', 'page', 97589, settings, {} );
initializeCommandPalette( { menu_commands: [], is_network_admin: false } );
