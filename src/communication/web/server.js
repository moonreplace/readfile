/**
 * @file server.js 用来取数据
 * @author daihuiming(moonreplace@163.com)
 */
var nodeRouter = require('./node-router');
var app = nodeRouter.getServer();
var config = require('../../config');
var levelDb = require('../../store/level');
var router = require('./router')

exports.start = function () {

    router(app);

    // 静态文件
    app.get(/^\/assets\/(.+)/, nodeRouter.staticDirHandler('public/'));


    app.listen(config.server.web.port);
};
