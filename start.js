var dnodeServer = require('./src/communication/dnode/server');
var webServer = require('./src/communication/web/server');

var cluster = require('cluster');
var http = require('http');
var numCPUs = 8;

if (cluster.isMaster) {

    var leveldb = require('./src/store/level');
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
   var worker =  cluster.fork();
   worker.on('message', function (data) {
       data.forEach(function (record) {
           var db = leveldb.get(record.dbName);
           db.push(record.data.key, record.data.value);
       });
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


