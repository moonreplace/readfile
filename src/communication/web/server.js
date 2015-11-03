/**
 * @file server.js 用来取数据
 * @author daihuiming(moonreplace@163.com)
 */
var nodeRouter = require('./node-router');
var server = nodeRouter.getServer();
var config = require('../../config');



exports.start = function () {
    //api 数据
    server.get(/^\/api\/pv\/(.+?)\/(.+?)$/, function (req, res, page, time) {
        console.log(page);
        console.log(time);
    });

    //

    // 静态文件
    server.get(/^\/assets\/(.+)/, nodeRouter.staticDirHandler('public/'));


    server.listen(config.server.web.port);
};
