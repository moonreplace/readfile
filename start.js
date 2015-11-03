var dnodeServer = require('./src/communication/dnode/server');
var webServer = require('./src/communication/web/server');

// 启动server
dnodeServer.start();
webServer.start();
