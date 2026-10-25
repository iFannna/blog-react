import { setupLocale } from './index.js';
import zhCN from './zh_CN.json';

/**
 * 该模块只会在 zh-CN 编辑器启动前被动态导入。
 * 编辑器与区块模块是静态导入、先于 boot 函数求值的，
 * 因此语言包必须在这里同步注册，否则模块级 `__()` 会固化为英文。
 */
setupLocale( undefined, zhCN );
