/**
 * @file util.js, 各种工具函数
 * @author daihuiming(moonreplace@163.com)
 */

exports.util = {
    /**
     * 在当前的content上来应用regEx
     *
     * @param {string} content，要应用的content
     * @param {RegExp} regExp, 要应用的正则表达式
     * @return {Array}
     */
    searchContent: function (content, regExp) {
        return regeEx.exec(content);
    }


};
