/**
 * @file processor.js, 各种processor的基类
 * @author daihuiming(moonreplace@163.com)
 */

var Stream = require('stream');
var util = require('util');

/**
 * 继承自stream的基类
 */
var Processor = function () {
    Stream.call(this);
    this.readable = true;
    this.writable = true;
};

util.inherits(Processor, Stream);

module.exports = Processor;
