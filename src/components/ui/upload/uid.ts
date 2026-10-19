/** 对应官方 upload.ts 的 genFileId：时间戳 + 自增序号，保证同一毫秒内也不重复。 */
let fileId = 1;

export const genFileId = () => Date.now() + fileId++;
