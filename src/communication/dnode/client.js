/**
 * @file client.js, 请求数据的客户端
 * @author daihuiming(moonreplace@163.com)
 */

var dnode = require('dnode');
var net = require('net');
var config = require('../../config');

/**
 * 开始传输数据
 *
 * @param {string} data
 */

var datas = []; // 存一万条记录才发送
exports.send = function (data) {
    datas.push(data);
    if (datas.length >= config.perform.count) {
        (function (datas) {
            dnode.connect(config.server.net.host, config.server.net.port, function (remote, conn) {
                remote.save(datas, function (msg) {
                    conn.end();
                });
            });
        }) (datas);
        datas = [];
    }
};

