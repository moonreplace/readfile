var client = require('./src/communication/dnode/client');
var config = require('./src/config');
var logData = require('./src/inputs/' + config.input.from);
var server = require('./src/communication/dnode/server');

// 启动server
// server.start();

// 得到新的

client.dnode.on('remote', function () {
    var inputStream = logData.get();

    inputStream.on('data', function (data) {
        client.send(data);
    });
});
