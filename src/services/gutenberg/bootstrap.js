import { initializeCommandPalette } from '@/components/gutenberg/core-commands';
import { initializeEditor } from '@/components/gutenberg/edit-post';
import { store as editorStore } from '@/components/gutenberg/editor';
import { dispatch } from '@/stores/gutenberg/data';
import settings from '@/lib/gutenberg/fixtures/settings.js';
import { installMockApi } from '@/services/gutenberg/mock/api.js';
import { configureCanvasAssets } from '@/styles/gutenberg/canvas.js';
import '@/styles/gutenberg/inline.js';
import '@/styles/gutenberg/compiled/index.js';
import '@/styles/gutenberg/index.css';

/**
 * 语言包在这里按需异步加载，而不是由外壳再开一个平级的动态导入：
 * 两个平级异步组会让 Turbopack 把 moment 与时区表各复制一份。
 */
export async function bootGutenberg( locale ) {
	if ( locale === 'zh-CN' ) {
		const { setupLocale } = await import( '@/lib/gutenberg/locale/index.js' );
		setupLocale( settings );
	} else {
		settings.locale = 'en_US';
		settings.isRTL = false;
	}

	installMockApi( settings.locale );
	configureCanvasAssets( settings );

	initializeEditor( 'editor', 'page', 97589, settings, {} );

	// The demo opens the block inserter by default on desktop only. The open
	// state lives in the editor store, so a refresh returns to this same default.
	if ( window.matchMedia( '(min-width: 782px)' ).matches ) {
		dispatch( editorStore ).setIsInserterOpened( true );
	}

	initializeCommandPalette();
}
