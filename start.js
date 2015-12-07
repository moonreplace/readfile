var dnodeServer = require('./src/communication/dnode/server');
var config = require('./src/config');
var Cache = require('./src/store/cache');
var util = require('util');

var memWatch = require('./tools/memwatch');

var cluster = require('cluster');
var numCPUs = 2;
var cache = Cache();

memWatch();

if (cluster.isMaster) {

    var leveldb = require('./src/store/level');
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        var worker =  cluster.fork();

        // 当收到数据的时候把数据写入数据库
        worker.on('message', function (receivedData) {
            if (receivedData.type === config.message.net) {
                // 对拿到的数据进行处理
                // {mapppedName: {key: []}}
                var data = receivedData.data;

                // 把数据存进去
                Object.keys(data).forEach(function (dbName) {
                    cache.add(dbName, data[dbName]);
                });

                Object.keys(cache.items).forEach(function (dbName) {
                    var cachedData = cache.get(dbName);
                    // 打开数据库
                    var db = leveldb.get(dbName);

                    // 对当前的数据库中的记录进行处理
                    Object.keys(cachedData[dbName]).forEach(function (key) {
                        if (cachedData[dbName][key]) {
                            db.put(key, cachedData[dbName][key]);
                        }
                    });

                    // 把当前的临时存储的数据去掉
                    cachedData = null;

                });
            }

        });
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
        cluster.fork();
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    // 启动server
    dnodeServer.start();

    process.on('uncaughtException', function (){
        //Send some notification about the error
        process.exit(1);
    });
}


