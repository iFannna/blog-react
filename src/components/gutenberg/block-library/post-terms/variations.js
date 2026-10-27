import { __ } from '@/lib/gutenberg/i18n';

/**
 * 上游的变体由 WordPress 服务端按分类法生成；本项目没有 WP 服务端，
 * 需要在这里补上公开分类法的变体，否则插入的区块没有 term。
 */
const variations = [
	{
		name: 'category',
		title: __( 'Categories' ),
		attributes: {
			term: 'category',
		},
		isActive: [ 'term' ],
		scope: [ 'inserter', 'transform' ],
		isDefault: true,
	},
	{
		name: 'post_tag',
		title: __( 'Tags' ),
		attributes: {
			term: 'post_tag',
		},
		isActive: [ 'term' ],
		scope: [ 'inserter', 'transform' ],
	},
];

export default variations;
