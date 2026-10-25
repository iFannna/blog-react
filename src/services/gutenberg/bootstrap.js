import { initializeCommandPalette } from '@/components/gutenberg/core-commands';
import { initializeEditor } from '@/components/gutenberg/edit-post';
import { store as editorStore } from '@/components/gutenberg/editor';
import { dispatch } from '@/stores/gutenberg/data';
import { setupLocale } from '@/lib/gutenberg/locale/index.js';
import settings from '@/lib/gutenberg/fixtures/settings.js';
import { installMockApi } from '@/services/gutenberg/mock/api.js';
import { configureCanvasAssets } from '@/styles/gutenberg/canvas.js';
import '@/styles/gutenberg/inline.js';
import '@/styles/gutenberg/compiled/index.js';
import '@/styles/gutenberg/index.css';

/**
 * 语言包由页面在导入本模块之前通过 `locale/preload-zh.js` 同步注册，
 * 以保证模块级 `__()` 常量在求值前拿到中文；这里只补日期与语言设置。
 */
export async function bootGutenberg( locale ) {
	if ( locale === 'zh-CN' ) {
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
