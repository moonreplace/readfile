/**
 * @file server.js, 数据处理的server
 * @author daihuiming(moonreplace@163.com)
 */

var dnode = require('dnode');
var net = require('net');
var config = require('../../config');
var PerformProcessor = require('../../processors/perform');

exports.start = function () {
var performProcessor = new PerformProcessor();
var server = net.createServer(function (client) {
    var d = dnode({
        /**
         * 我们一次存储多少条记录
         *
         * @param {Array} data, 一次传输过来的数据
         * @param {Function} cb, 当前的回调函数
         */
        save : function (data, cb) {
            performProcessor.process(data);
            cb && cb(); // 返回给客户端的信息值
        }
    });

    try {
        client.pipe(d).pipe(client);
    }
    catch (ex) {
        console.log(ex);
    }

    d.on('error', function (err) {
        console.log(err);
    });
});

    server.listen(config.server.net.port);
    console.log('server start');
};

exports.deal = function (data) {

};
