import { setLocaleData } from '@wordpress/i18n';
import { getSettings, setSettings } from '@wordpress/date';
import zhCN from './zh_CN.json';

const ZH_L10N = {
	locale: 'zh_CN',
	months: [
		'1月',
		'2月',
		'3月',
		'4月',
		'5月',
		'6月',
		'7月',
		'8月',
		'9月',
		'10月',
		'11月',
		'12月',
	],
	monthsShort: [
		'1月',
		'2月',
		'3月',
		'4月',
		'5月',
		'6月',
		'7月',
		'8月',
		'9月',
		'10月',
		'11月',
		'12月',
	],
	weekdays: [
		'星期日',
		'星期一',
		'星期二',
		'星期三',
		'星期四',
		'星期五',
		'星期六',
	],
	weekdaysShort: [ '周日', '周一', '周二', '周三', '周四', '周五', '周六' ],
	meridiem: { am: '上午', pm: '下午', AM: '上午', PM: '下午' },
	relative: {
		future: '%s后',
		past: '%s前',
		s: '几秒',
		ss: '%d 秒',
		m: '1 分钟',
		mm: '%d 分钟',
		h: '1 小时',
		hh: '%d 小时',
		d: '1 天',
		dd: '%d 天',
		M: '1 个月',
		MM: '%d 个月',
		y: '1 年',
		yy: '%d 年',
	},
	startOfWeek: 1,
};

const ZH_FORMATS = {
	time: 'H:i',
	date: 'Y年n月j日',
	datetime: 'Y年n月j日 H:i',
	datetimeAbbreviated: 'Y年n月j日 H:i',
};

export function setupLocale( settings ) {
	setLocaleData( zhCN, 'default' );

	const dateSettings = getSettings();
	setSettings( {
		...dateSettings,
		l10n: { ...dateSettings.l10n, ...ZH_L10N },
		formats: ZH_FORMATS,
	} );

	if ( settings ) {
		settings.locale = 'zh_CN';
		settings.isRTL = false;
	}
}
