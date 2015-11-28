/**
 * @file client.js, 请求数据的客户端
 * @author daihuiming(moonreplace@163.com)
 */

var dnode = require('dnode');
var config = require('../../config');

/**
 * 开始传输数据
 *
 * @param {string} data
 */

// 存一万条记录才发送
var datas = [];

var dnode = dnode.connect(config.server.net.host, config.server.net.port, function (remote, conn) {
    exports.send = function (data) {
        datas.push(data);

        if (datas.length >= config.perform.count) {
            remote.save(datas);
            datas = [];
        }
    };

    dnode.on('error', function (err) {
        console.log(err);
        // conn.end();
    });
});

exports.dnode = dnode;
