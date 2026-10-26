/**
 * @typedef {Object} MediaDataSource
 * @property {(id: number|string) => Promise<any>} getRecord
 * @property {(query: Object) => Promise<{ records: any[], totalItems: number, totalPages: number }>} listRecords
 * @property {(id: number|string, record: Object, persistedRecord?: Object) => Promise<any>} updateRecord
 * @property {(id: number|string) => Promise<Object>} deleteRecord
 * @property {(file: File) => Promise<any>} uploadFile
 * @property {(url: string) => Promise<any>} uploadFromUrl
 */

/** @type {MediaDataSource | null} */
let mediaDataSource = null;

/**
 * 安装编辑器媒体数据源。传入 null 时恢复默认的 WP REST 行为。
 * 项目编辑器用它把 attachment 实体读写直接指向项目媒体接口。
 *
 * @param {MediaDataSource | null} source 媒体数据源
 */
export function setMediaDataSource( source ) {
	mediaDataSource = source ?? null;
}

/**
 * 读取当前安装的媒体数据源，示例编辑器返回 null。
 *
 * @return {MediaDataSource | null} 当前媒体数据源
 */
export function getMediaDataSource() {
	return mediaDataSource;
}
