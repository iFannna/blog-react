import { initializeCommandPalette } from '@/components/gutenberg/core-commands';
import { initializeEditor } from '@/components/gutenberg/edit-post';
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
	initializeCommandPalette( { menu_commands: [], is_network_admin: false } );
}
