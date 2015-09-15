/**
 * @file deal.js, 设置输入源并且
 * @author daihuiming(moonreplace@163.com)
 */

var readline = require('readline');

/**
 * 处理得到的data, 把它变为一行行的数据
 *
 * @param {Stream} inputStream, 要处理的总体数据
 * @param {Stream} outputStream, 处理过之后的数据
 * @param {Function} callBack, 当得到每一行的时候，我们来进行
 */
exports.deal = function (inputStream, callBack) {

    // 读取源文件中的每一行数据，以方便处理
    var lines = readline.createInterface({
        input: inputStream,
        terminal: false // 如果不设置这个值，则它认为是来自CLI
    });

    // 当得到一行数据时，就把当前的数据输出
    lines.on('line', function (data) {
        callBack(data);
    });
};


