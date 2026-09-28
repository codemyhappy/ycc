/**
 * @file    Ycc.class.js
 * @author  xiaohei
 * @date    2017/9/30
 * @description  Ycc.class文件
 *
 */
type YccConfig = {
    /**
     * - 是否显示所有UI的容纳区域
     */
    debugDrawContainer?: boolean;
};
/**
 * @typedef {Object} YccConfig
 * @property {boolean} [debugDrawContainer=false] - 是否显示所有UI的容纳区域
 */
/**
 * 应用启动入口类，每个实例都与一个canvas绑定。
 * 该canvas元素会被添加至HTML结构中，作为应用的显示舞台。
 * @param {YccConfig} [config] - 整个ycc的配置项
 * @constructor
 */
declare var Ycc: (config?: YccConfig) => void;
