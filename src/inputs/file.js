/**
 * @file file.js, 读取从文件源文件中过来的数据源
 * @author daihuiming(moonreplace@163.com)
 */

var Stream = require('stream');
var config = require('../config');
var fs = require('fs');
var dealing = require('./deal');

// 要读取的文件的名称
var fileName = config.input.file.sourceFile;
var outputStream = new Stream();
outputStream.readable = true;
outputStream.writable = true;

// 得到当前的文件
var startSize = fs.statSync(fileName).size;

setInterval(
    function () {
        // 当前的文件大小
        var stat = fs.statSync(fileName);
        if (startSize !== stat.size) {
            // 当文件被删除的时候，我们要处理这种特殊情况
            if (startSize > stat.size) {
                startSize = 0;
            }
            // 从改变前的尾部读取数据，我们只需要增量更新的数据
            var inputStream = fs.createReadStream(fileName, {start: startSize});
            dealing.deal(inputStream, function (data) {
                outputStream.emit('data', data);
            });
        }
        startSize = stat.size;
    },
    // 1秒钟来进行一次查询，来得到上次得到的数据
    config.input.file.interval
);

exports.get = function () {
    return outputStream;
};
