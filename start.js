var dnodeServer = require('./src/communication/dnode/server');
var webServer = require('./src/communication/web/server');
var config = require('./src/config');

var cluster = require('cluster');
var http = require('http');
var numCPUs = 2;

if (cluster.isMaster) {

    var leveldb = require('./src/store/level');
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        var worker =  cluster.fork();

        // 当收到数据的时候把数据写入数据库
        worker.on('message', function (type, data) {

            if (type === config.message.net) {
                // 对拿到的数据进行处理
                // {mapppedName: []}
                Object.keys(data).forEach(function (key) {
                    // 打开数据库
                    var db = leveldb.get(key);
                    // 对当前的数据库中的记录进行处理
                    data[key].forEach(function (record) {
                        db.push(record.data.key, record.data.value);
                    });
                });
            }

        });

        webServer.start();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    // 启动server
    dnodeServer.start(leveldb);
}


